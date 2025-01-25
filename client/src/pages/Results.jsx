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

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: []
      }
    ]
  });

  const [chartOptions, setChartOptions] = useState({
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "RPM"
        }
      },
      y: {
        title: {
          display: true,
          text: "Nm, KM"
        }
      }
    }
  });

  useEffect(() => {
    if (state !== null) {
      switch (state.option) {
        case 'powerGraph':
          let graphRpmArray = [];
          let graphTorqueArray = [];
          let graphHorsepowerArray = [];
          let graphData = [];

          const powerGraphVaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const powerGraphMassFractionOfWater = (state.air_humidity / 100) * ((powerGraphVaporPressureOfWater * 10) / state.air_pressure);
          const powerGraphMolarMassOfMoistAir = ((1 - powerGraphMassFractionOfWater) * 28.966) + (powerGraphMassFractionOfWater * 18.015);
          const powerGraphAirDensity = ((state.air_pressure * 100) * powerGraphMolarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));

          for (let i = 0; i < state.accel_intervals.length; i++) {
            const velocityDelta = (state.accel_intervals[i].max_speed - state.accel_intervals[i].min_speed) / 3.6;
            const graphAcceleration = velocityDelta / state.accel_intervals[i].time;
            const force = state.car_weight * graphAcceleration;

            const minSpeedAirResistance = 0.5 * powerGraphAirDensity * ((state.accel_intervals[i].min_speed / 3.6) * (state.accel_intervals[i].min_speed / 3.6)) * state.drag_coefficient * state.frontal_area;
            const maxSpeedAirResistance = 0.5 * powerGraphAirDensity * ((state.accel_intervals[i].max_speed / 3.6) * (state.accel_intervals[i].max_speed / 3.6)) * state.drag_coefficient * state.frontal_area;
            const avgAirResistance = minSpeedAirResistance + ((maxSpeedAirResistance - minSpeedAirResistance) / 2);

            const minSpeedrollingResistanceCoefficient = (((((state.accel_intervals[i].min_speed / 100) * (state.accel_intervals[i].min_speed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            const maxSpeedrollingResistanceCoefficient = (((((state.accel_intervals[i].max_speed / 100) * (state.accel_intervals[i].max_speed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            const avgRollingResistanceCoefficient = minSpeedrollingResistanceCoefficient + ((maxSpeedrollingResistanceCoefficient - minSpeedrollingResistanceCoefficient) / 2);
            const avgRollingResistance = state.car_weight * 9.80665 * avgRollingResistanceCoefficient;

            const overallForce = force + avgAirResistance + avgRollingResistance;
            const wheelRadius = (((state.tyre_ratio / 100) * state.tyre_width) + (state.tyre_diameter * 12.7)) / 1000;
            const wheelTorque = overallForce * wheelRadius;
            const engineTorque = (wheelTorque * 1.141) / (state[`gear_${state.accel_gear}`] * state.final_drive);

            const minEngineRPM = ((state.accel_intervals[i].min_speed * 100000) / (state.wheel_circumference * 60)) * (state[`gear_${state.accel_gear}`] * state.final_drive);
            const maxEngineRPM = ((state.accel_intervals[i].max_speed * 100000) / (state.wheel_circumference * 60)) * (state[`gear_${state.accel_gear}`] * state.final_drive);
            const avgEngineRPM = minEngineRPM + ((maxEngineRPM - minEngineRPM) / 2);

            const engineHorsepower = (engineTorque * avgEngineRPM) / 7023.49570;

            graphRpmArray.push(Math.round(avgEngineRPM));
            graphTorqueArray.push(Math.round((engineTorque + Number.EPSILON) * 100) / 100);
            graphHorsepowerArray.push(Math.round((engineHorsepower + Number.EPSILON) * 100) / 100);

            graphData.push(
              {
                id: i,
                rpm: Math.round(avgEngineRPM),
                torque: Math.round((engineTorque + Number.EPSILON) * 100) / 100,
                horsepower: Math.round((engineHorsepower + Number.EPSILON) * 100) / 100
              }
            );
          }
          setChartOptions(prevState => {
            prevState.scales.x.title.text = "RPM";
            prevState.scales.y.title.text = "Nm, KM";
            return {
              ...prevState
            }
          });
          setChartData(prevState => {
            prevState.labels = graphRpmArray;
            prevState.datasets[0].data = graphTorqueArray;
            prevState.datasets[0].label = 'Moment obrotowy';
            prevState.datasets.push(
              {
                label: 'Moc',
                data: graphHorsepowerArray
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
          axios
            .post('http://localhost:8080/results/save', {
              type: 'powerGraph',
              data: {
                type: 'powerGraph',
                graph_data: graphData
              }
            })
            .then(res => navigate(`/wynik/${res.data}`))
            .catch(err => console.log(err));
          break;
        case 'accel':
          // let accelRpmArray = [];
          // let accelTorqueArray = [];
          // let accelHorsepowerArray = [];
          let accelTimes = [];
          // let accelData = [];
          let accelGears = [];
          let accelEngineRPM, accelEngineTorque, accelLowerRPMInterval, accelHigherRPMInterval, accelWheelTorque, accelRollingResistanceCoefficient, accelRollingResistance, accelAirResistance, acceleration, accelTime;

          const accelVaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const accelMassFractionOfWater = (state.air_humidity / 100) * ((accelVaporPressureOfWater * 10) / state.air_pressure);
          const accelMolarMassOfMoistAir = ((1 - accelMassFractionOfWater) * 28.966) + (accelMassFractionOfWater * 18.015);
          const accelAirDensity = ((state.air_pressure * 100) * accelMolarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));

          const accelWheelRadius = (((state.tyre_ratio / 100) * state.tyre_width) + (state.tyre_diameter * 12.7)) / 1000;

          for (let i = 1; i <= state.number_of_gears; i++ ) {
            const maxSpeed = (state.torque_intervals[state.torque_intervals.length - 1].rpm / (state[`gear_${i}`] * state.final_drive)) * 60 * (state.wheel_circumference / 100000);
            accelGears.push(
              {
                gear: i,
                ratio: state[`gear_${i}`],
                maxSpeed: maxSpeed
              }
            );
          }

          for (let speed = 1; speed <= 100; speed++) {
            accelRollingResistanceCoefficient = (((((speed / 100) * (speed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            accelRollingResistance = state.car_weight * 9.80665 * accelRollingResistanceCoefficient;

            accelAirResistance = 0.5 * accelAirDensity * ((speed / 3.6) * (speed / 3.6)) * state.drag_coefficient * state.frontal_area;

            accelGears.forEach(gear => {
              if (gear.gear === 1 && speed <= accelGears[0].maxSpeed) {
                accelEngineRPM = ((speed * 100000) / (60 * state.wheel_circumference)) * gear.ratio * state.final_drive;
                if (accelEngineRPM < state.torque_intervals[0].rpm) {
                  accelEngineTorque = state.torque_intervals[0].torque * (accelEngineRPM / state.torque_intervals[0].rpm);
                }
                else {
                  state.torque_intervals.forEach(interval => {
                    if (interval.rpm < accelEngineRPM) {
                      accelLowerRPMInterval = interval;
                      accelHigherRPMInterval = state.torque_intervals[interval.id + 1];
                    }
                  });
                  accelEngineTorque = ((accelHigherRPMInterval.torque - accelLowerRPMInterval.torque) * ((accelEngineRPM - accelLowerRPMInterval.rpm) / (accelHigherRPMInterval.rpm - accelLowerRPMInterval.rpm))) + accelLowerRPMInterval.torque;
                }
                accelWheelTorque = accelEngineTorque * gear.ratio * state.final_drive * 0.87642;
                acceleration = (((accelWheelTorque / accelWheelRadius) - accelRollingResistance) - accelAirResistance) / state.car_weight;
                accelTime = 1 / (3.6 * acceleration);
                accelTimes.push(accelTime);
              }
              else if (gear.gear !== 1 && speed > accelGears[gear.gear - 2].maxSpeed && speed <= gear.maxSpeed) {
                accelEngineRPM = ((speed * 100000) / (60 * state.wheel_circumference)) * gear.ratio * state.final_drive;
                if (accelEngineRPM < state.torque_intervals[0].rpm) {
                  accelEngineTorque = state.torque_intervals[0].torque * (accelEngineRPM / state.torque_intervals[0].rpm);
                }
                else {
                  state.torque_intervals.forEach(interval => {
                    if (interval.rpm < accelEngineRPM) {
                      accelLowerRPMInterval = interval;
                      accelHigherRPMInterval = state.torque_intervals[interval.id + 1];
                    }
                  });
                  accelEngineTorque = ((accelHigherRPMInterval.torque - accelLowerRPMInterval.torque) * ((accelEngineRPM - accelLowerRPMInterval.rpm) / (accelHigherRPMInterval.rpm - accelLowerRPMInterval.rpm))) + accelLowerRPMInterval.torque;
                }
                accelWheelTorque = accelEngineTorque * gear.ratio * state.final_drive * 0.87642;
                acceleration = (((accelWheelTorque / accelWheelRadius) - accelRollingResistance) - accelAirResistance) / state.car_weight;
                if (speed - 1 === Math.floor(accelGears[gear.gear - 2].maxSpeed)) {
                  accelTime = (1 / (3.6 * acceleration)) + state.gear_change_time;
                }
                else {
                  accelTime = 1 / (3.6 * acceleration);
                }
                accelTimes.push(accelTime);
              }
            });
          }

          const accelerationTime = accelTimes.reduce((acc, val) => {
            return acc + val;
          }, 0);

          setResult({
            type: 'accel',
            accel: accelerationTime
            // vmax:
          });
          axios
            .post('http://localhost:8080/results/save', {
              type: 'accel',
              data: {
                type: 'accel',
                accel: accelerationTime
              }
            })
            .then(res => navigate(`/wynik/${res.data}`))
            .catch(err => console.log(err));
          break;
        case 'aero':
          const aeroSpeed = state.step_4_option === 'aero_set_speed_value' ? state.set_speed : 120;
          const vaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const massFractionOfWater = (state.air_humidity / 100) * ((vaporPressureOfWater * 10) / state.air_pressure);
          const molarMassOfMoistAir = ((1 - massFractionOfWater) * 28.966) + (massFractionOfWater * 18.015);
          const airDensity = ((state.air_pressure * 100) * molarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));
          let aeroLabelArray = [];
          let aeroDataArray = [];
          let aeroData = {};

          if (state.step_4_option === 'aero_set_speed_value') {
            value = 0.5 * airDensity * ((aeroSpeed / 3.6) * (aeroSpeed / 3.6)) * state.drag_coefficient * state.frontal_area;
          }
          else {
            for (let i = state.speed_range_min; i <= state.speed_range_max; i++) {
              aeroLabelArray.push(i);
              aeroDataArray.push(0.5 * airDensity * ((i / 3.6) * (i / 3.6)) * state.drag_coefficient * state.frontal_area);
            }
            setChartOptions(prevState => {
              prevState.scales.x.title.text = "km/h";
              prevState.scales.y.title.text = "N";
              return {
                ...prevState
              }
            });
            setChartData(prevState => {
              prevState.labels = aeroLabelArray;
              prevState.datasets[0].data = aeroDataArray;
              prevState.datasets[0].label = 'Opór powietrza w zależności od prędkości';
              return {
                ...prevState
              }
            });
          }

          if (state.step_4_option === 'aero_set_speed_value') {
            aeroData = {
              type: 'aero',
              speed_type: 'set_speed',
              speed: aeroSpeed,
              value: value
            }
          }
          else {
            aeroData = {
              type: 'aero',
              speed_type: 'speed_range',
              speed_array: aeroLabelArray,
              value_array: aeroDataArray
            }
          }

          setResult(aeroData);
          axios
            .post('http://localhost:8080/results/save', {
              type: 'aero',
              data: aeroData
            })
            .then(res => navigate(`/wynik/${res.data}`))
            .catch(err => console.log(err));
          break;
        case 'roll':
          const rollSpeed = state.step_4_option === 'roll_set_speed_value' ? state.set_speed : 120;
          let rollLabelArray = [];
          let rollDataArray = [];
          let rollData = {};

          if (state.step_4_option === 'roll_set_speed_value') {
            const rollingResistanceCoefficient = (((((rollSpeed / 100) * (rollSpeed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
            value = state.car_weight * 9.80665 * rollingResistanceCoefficient;
          }
          else {
            for (let i = state.speed_range_min; i <= state.speed_range_max; i++) {
              rollLabelArray.push(i);
              const rollingResistanceCoefficient = (((((i / 100) * (i / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
              rollDataArray.push(state.car_weight * 9.80665 * rollingResistanceCoefficient);
            }
            setChartOptions(prevState => {
              prevState.scales.x.title.text = "km/h";
              prevState.scales.y.title.text = "N";
              return {
                ...prevState
              }
            });
            setChartData(prevState => {
              prevState.labels = rollLabelArray;
              prevState.datasets[0].data = rollDataArray;
              prevState.datasets[0].label = 'Opór toczenia w zależności od prędkości';
              return {
                ...prevState
              }
            });
          }

          if (state.step_4_option === 'roll_set_speed_value') {
            rollData = {
              type: 'roll',
              speed_type: 'set_speed',
              speed: rollSpeed,
              value: value
            }
          }
          else {
            rollData = {
              type: 'roll',
              speed_type: 'speed_range',
              speed_array: rollLabelArray,
              value_array: rollDataArray
            }
          }

          setResult(rollData);
          axios
            .post('http://localhost:8080/results/save', {
              type: 'roll',
              data: rollData
            })
            .then(res => navigate(`/wynik/${res.data}`))
            .catch(err => console.log(err));
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
            switch (res.data.type) {
              case 'powerGraph':
                let graphRpmArray = [];
                let graphTorqueArray = [];
                let graphHorsepowerArray = [];

                obj.graph_data.forEach(element => {
                  graphRpmArray.push(element.rpm);
                  graphTorqueArray.push(element.torque);
                  graphHorsepowerArray.push(element.horsepower);
                });

                setChartOptions(prevState => {
                  prevState.scales.x.title.text = "RPM";
                  prevState.scales.y.title.text = "Nm, KM";
                  return {
                    ...prevState
                  }
                });
                setChartData(prevState => {
                  prevState.labels = graphRpmArray;
                  prevState.datasets[0].data = graphTorqueArray;
                  prevState.datasets[0].label = 'Moment obrotowy';
                  prevState.datasets.push(
                    {
                      label: 'Moc',
                      data: graphHorsepowerArray
                    }
                  );
                  return {
                    ...prevState
                  }
                });

                setResult({
                  type: 'powerGraph',
                  graph_data: obj.graph_data
                });
                break;
              case 'accel':
                setResult({
                  type: 'accel',
                  accel: obj.accel
                });
                break;
              case 'aero':
                if (obj.speed_type === 'set_speed') {
                  setResult({
                    type: 'aero',
                    speed_type: 'set_speed',
                    speed: obj.speed,
                    value: obj.value
                  });
                }
                else {
                  setChartOptions(prevState => {
                    prevState.scales.x.title.text = "km/h";
                    prevState.scales.y.title.text = "N";
                    return {
                      ...prevState
                    }
                  });
                  setChartData(prevState => {
                    prevState.labels = obj.speed_array;
                    prevState.datasets[0].data = obj.value_array;
                    prevState.datasets[0].label = 'Opór powietrza w zależności od prędkości';
                    return {
                      ...prevState
                    }
                  });

                  setResult({
                    type: 'aero',
                    speed_type: 'speed_range',
                    speed_array: obj.speed_array,
                    value_array: obj.value_array
                  });
                }
                break;
              case 'roll':
                if (obj.speed_type === 'set_speed') {
                  setResult({
                    type: 'roll',
                    speed_type: 'set_speed',
                    speed: obj.speed,
                    value: obj.value
                  });
                }
                else {
                  setChartOptions(prevState => {
                    prevState.scales.x.title.text = "km/h";
                    prevState.scales.y.title.text = "N";
                    return {
                      ...prevState
                    }
                  });
                  setChartData(prevState => {
                    prevState.labels = obj.speed_array;
                    prevState.datasets[0].data = obj.value_array;
                    prevState.datasets[0].label = 'Opór toczenia w zależności od prędkości';
                    return {
                      ...prevState
                    }
                  });

                  setResult({
                    type: 'roll',
                    speed_type: 'speed_range',
                    speed_array: obj.speed_array,
                    value_array: obj.value_array
                  });
                }
                break;
            }
            
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
        <LineChart chartData={chartData} chartOptions={chartOptions} /> : ''
      }
      {result.type === 'aero' && result.speed_type === 'set_speed' ? (
        <h3 className="result-heading">Przy prędkości {result.speed} km/h opór powietrza wynosi: {Math.round(result.value * 100) / 100}  N</h3>
      ) : ''}
      {result.type === 'roll' && result.speed_type === 'set_speed' ? (
        <h3 className="result-heading">Przy prędkości {result.speed} km/h opór toczenia wynosi: {Math.round((result.value + Number.EPSILON) * 100) / 100} N</h3>
      ) : ''}
      {result.type === 'powerGraph' ? result.graph_data.map(element => <h3 key={element.id} className="results-graph-data">{element.rpm} RPM: {element.torque} Nm, {element.horsepower} KM</h3>) : ''}
      {result.type === 'accel' ? (
        <h3 className="result-heading">Dla podanych wartości momentu obrotowego przyspieszenie od 0 do 100 km/h wynosi: {Math.round((result.accel + Number.EPSILON) * 100) / 100} s</h3>
      ) : ''}
    </div>
  );
}

export default Results;