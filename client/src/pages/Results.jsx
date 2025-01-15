import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import LineChart from '../components/LineChart';

Chart.register(CategoryScale);

function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [result, setResult] = useState({
    type: ''
  });
  let value;
  let listGraphData = [];
  console.log(state);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: []
      }
    ]

  });

  useEffect(() => {
    if (state !== null) {
      switch (state.option) {
        case 'powerGraph':
          let rpmArray = [];
          let torqueArray = [];
          let horsepowerArray = [];
          let graphData = [];

          const powerGraphVaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const powerGraphMassFractionOfWater = (state.air_humidity / 100) * ((powerGraphVaporPressureOfWater * 10) / state.air_pressure);
          const powerGraphMolarMassOfMoistAir = ((1 - powerGraphMassFractionOfWater) * 28.966) + (powerGraphMassFractionOfWater * 18.015);
          const powerGraphAirDensity = ((state.air_pressure * 100) * powerGraphMolarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));

          for (let i = 0; i < state.accel_intervals.length; i++) {
            const velocityDelta = (state.accel_intervals[i].max_speed - state.accel_intervals[i].min_speed) / 3.6;
            const acceleration = velocityDelta / state.accel_intervals[i].time;
            const force = state.car_weight * acceleration;

            const minSpeedAirResistance = 0.5 * powerGraphAirDensity * ((state.accel_intervals[i].min_speed / 3.6) * (state.accel_intervals[i].min_speed / 3.6)) * state.drag_coefficient * state.frontal_area;
            const maxSpeedAirResistance = 0.5 * powerGraphAirDensity * ((state.accel_intervals[i].max_speed / 3.6) * (state.accel_intervals[i].max_speed / 3.6)) * state.drag_coefficient * state.frontal_area;
            const avgAirResistance = minSpeedAirResistance + ((maxSpeedAirResistance - minSpeedAirResistance) / 2);

            const minSpeedrollingResistanceCoefficient = (((((state.accel_intervals[i].min_speed / 100) * (state.accel_intervals[i].min_speed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            const maxSpeedrollingResistanceCoefficient = (((((state.accel_intervals[i].max_speed / 100) * (state.accel_intervals[i].max_speed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            const avgRollingResistanceCoefficient = minSpeedrollingResistanceCoefficient + ((maxSpeedrollingResistanceCoefficient - minSpeedrollingResistanceCoefficient) / 2);
            const avgRollingResistance = state.car_weight * 9.80665 * avgRollingResistanceCoefficient;

            const overallForce = force + avgAirResistance + avgRollingResistance;
            const wheelRadius = (((state.tyre_ratio / 100) * state.tyre_width) + (state.tyre_diameter * 12,7)) / 1000;
            const wheelTorque = overallForce * wheelRadius;
            const engineTorque = (wheelTorque * 1.141) / (state[`gear_${state.accel_gear}`] * state.final_drive);

            const minEngineRPM = ((state.accel_intervals[i].min_speed * 100000) / (state.wheel_circumference * 60)) * (state[`gear_${state.accel_gear}`] * state.final_drive);
            const maxEngineRPM = ((state.accel_intervals[i].max_speed * 100000) / (state.wheel_circumference * 60)) * (state[`gear_${state.accel_gear}`] * state.final_drive);
            const avgEngineRPM = minEngineRPM + ((maxEngineRPM - minEngineRPM) / 2);

            const engineHorsepower = (engineTorque * avgEngineRPM) / 7023.49537;

            rpmArray.push(Math.round(avgEngineRPM));
            torqueArray.push(Math.round((engineTorque + Number.EPSILON) * 100) / 100);
            horsepowerArray.push(Math.round((engineHorsepower + Number.EPSILON) * 100) / 100);

            graphData.push(
              {
                id: i,
                rpm: Math.round(avgEngineRPM),
                torque: Math.round((engineTorque + Number.EPSILON) * 100) / 100,
                horsepower: Math.round((engineHorsepower + Number.EPSILON) * 100) / 100
              }
            );
          }
          setChartData(prevState => {
            prevState.labels = rpmArray;
            prevState.datasets[0].data = torqueArray;
            prevState.datasets[0].label = 'Moment obrotowy';
            prevState.datasets.push(
              {
                label: 'Moc',
                data: horsepowerArray
              }
            );
            return {
              ...prevState
            }
          });
          setResult({
            type: 'powerGraph',
            graph_data: graphData
          });
          break;
        case 'accel':
          break;
        case 'aero':
          const aeroSpeed = state.step_4_option === 'aero_set_speed_value' ? state.set_speed : 120;
          const vaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const massFractionOfWater = (state.air_humidity / 100) * ((vaporPressureOfWater * 10) / state.air_pressure);
          const molarMassOfMoistAir = ((1 - massFractionOfWater) * 28.966) + (massFractionOfWater * 18.015);
          const airDensity = ((state.air_pressure * 100) * molarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));

          if (state.step_4_option === 'aero_set_speed_value') {
            value = 0.5 * airDensity * ((aeroSpeed / 3.6) * (aeroSpeed / 3.6)) * state.drag_coefficient * state.frontal_area;
          }
          else {
            const labelArray = [];
            const dataArray = [];
            for (let i = state.speed_range_min; i <= state.speed_range_max; i++) {
              labelArray.push(i);
              dataArray.push(0.5 * airDensity * ((i / 3.6) * (i / 3.6)) * state.drag_coefficient * state.frontal_area);
            }
            setChartData(prevState => {
              prevState.labels = labelArray;
              prevState.datasets[0].data = dataArray;
              prevState.datasets[0].label = 'Opór powietrza w zależności od prędkości';
              return {
                ...prevState
              }
            });
          }
          
          setResult({
            type: 'aero',
            speed_type: state.step_4_option === 'aero_set_speed_value' ? 'set_speed' : 'speed_range',
            speed: state.step_4_option === 'aero_set_speed_value' ? aeroSpeed : [state.speed_range_min, state.speed_range_max],
            value: state.step_4_option === 'aero_set_speed_value' ? value : chartData.datasets[0].data
          });
          // axios
          //   .post('http://localhost:8080/results/save', {
          //     type: 'aero',
          //     data: {
          //       result: value,
          //       speed: aeroSpeed
          //     }
          //   })
          //   .then(res => navigate(`/wynik/${res.data}`))
          //   .catch(err => console.log(err));
          break;
        case 'roll':
          const rollSpeed = state.step_4_option === 'roll_set_speed_value' ? state.set_speed : 120;

          if (state.step_4_option === 'roll_set_speed_value') {
            const rollingResistanceCoefficient = (((((rollSpeed / 100) * (rollSpeed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            value = state.car_weight * 9.80665 * rollingResistanceCoefficient;
          }
          else {
            const labelArray = [];
            const dataArray = [];
            for (let i = state.speed_range_min; i <= state.speed_range_max; i++) {
              labelArray.push(i);
              const rollingResistanceCoefficient = (((((i / 100) * (i / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
              dataArray.push(state.car_weight * 9.80665 * rollingResistanceCoefficient);
            }
            setChartData(prevState => {
              prevState.labels = labelArray;
              prevState.datasets[0].data = dataArray;
              prevState.datasets[0].label = 'Opór toczenia w zależności od prędkości';
              return {
                ...prevState
              }
            });
          }

          setResult({
            type: 'roll',
            speed_type: state.step_4_option === 'roll_set_speed_value' ? 'set_speed' : 'speed_range',
            speed: state.step_4_option === 'roll_set_speed_value' ? rollSpeed : [state.speed_range_min, state.speed_range_max],
            value: state.step_4_option === 'roll_set_speed_value' ? value : chartData.datasets[0].data
          });
          // axios
          //   .post('http://localhost:8080/results/save', {
          //     type: 'aero',
          //     data: {
          //       result: value,
          //       speed: aeroSpeed
          //     }
          //   })
          //   .then(res => navigate(`/wynik/${res.data}`))
          //   .catch(err => console.log(err));
          break;
        case 'all':
          break;
      }
    }
    else {
      if (id !== undefined) {
        axios
          .get(`http://localhost:8080/results/${id}`)
          .then(res => {
            const obj = JSON.parse(res.data.data);
            setResult({
              type: res.data.type,
              value: obj.result,
              speed: obj.speed
            });
          })
          .catch(() => navigate('/'));
      }
      else{
        navigate('/');
      }
    }
  }, []);
  
  return (
    <div className="results-container">
      <h1>Oto wyniki kalkulacji</h1>
      {
        result.type === 'aero' && result.speed_type === 'speed_range' ||
        result.type === 'roll' && result.speed_type === 'speed_range' ||
        result.type === 'powerGraph' ?
        <LineChart chartData={chartData} /> : ''
      }
      {result.type === 'aero' && result.speed_type === 'set_speed' ? (
        <h3 className="result-heading">Przy prędkości {result.speed} km/h opór powietrza wynosi: {Math.round(result.value * 100) / 100}  N</h3>
      ) : ''}
      {result.type === 'roll' && result.speed_type === 'set_speed' ? (
        <h3 className="result-heading">Przy prędkości {result.speed} km/h opór toczenia wynosi: {Math.round((result.value + Number.EPSILON) * 100) / 100} N</h3>
      ) : ''}
      {result.type === 'powerGraph' ? result.graph_data.map(element => <h3 key={element.id} className="results-graph-data">{element.rpm} RPM: {element.torque} Nm, {element.horsepower} KM</h3>) : ''}
    </div>
  );
}

export default Results;