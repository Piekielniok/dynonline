import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [result, setResult] = useState({
    type: ''
  });
  let value;
  console.log(state);

  useEffect(() => {
    if (state !== null) {
      switch (state.option) {
        case 'graph':
          break;
        case 'accel':
          break;
        case 'aero':
          const aeroSpeed = state.step_4_option === 'aero_set_speed_value' ? state.set_speed : 120;
          const vaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const massFractionOfWater = (state.air_humidity / 100) * ((vaporPressureOfWater * 10) / state.air_pressure);
          const molarMassOfMoistAir = ((1 - massFractionOfWater) * 28.966) + (massFractionOfWater * 18.015);
          const airDensity = ((state.air_pressure * 100) * molarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));
          value = 0.5 * airDensity * ((aeroSpeed / 3.6) * (aeroSpeed / 3.6)) * state.drag_coefficient * state.frontal_area;
          setResult({
            type: 'aero',
            value: value,
            speed: aeroSpeed
          });
          axios
            .post('http://localhost:8080/results/save', {
              type: 'aero',
              data: {
                result: value,
                speed: speed
              }
            })
            .then(res => navigate(`/wynik/${res.data}`))
            .catch(err => console.log(err));
          break;
        case 'roll':
          const rollSpeed = state.step_4_option === 'roll_set_speed_value' ? state.set_speed : 120;
          const rollingResistanceCoefficient = (((((rollSpeed / 100) * (rollSpeed / 100)) * 0.0095) + 0.01) * (1 / state.tyre_pressure)) + 0.005;
          value = state.car_weight * 9.80665 * rollingResistanceCoefficient;
          setResult({
            type: 'roll',
            value: value,
            speed: rollSpeed
          });
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
    <div>
      {result.type === 'aero' ? (
        <h3 className="result-heading">Przy prędkości {result.speed} km/h opór powietrza wynosi: {result.value} N</h3>
      ) : ''}
      {result.type === 'roll' ? (
        <h3 className="result-heading">Przy prędkości {result.speed} km/h opór toczenia wynosi: {result.value} N</h3>
      ) : ''}
      {id}
    </div>
  );
}

export default Results;