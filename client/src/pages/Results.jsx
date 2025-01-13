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
          const speed = state.step_4_option === 'aero_set_speed_value' ? state.set_speed : 120;
          const vaporPressureOfWater = 0.61121 * Math.exp((18.678 - (state.air_temperature / 234.5)) * (state.air_temperature / (257.14 + state.air_temperature)));
          const massFractionOfWater = (state.air_humidity / 100) * ((vaporPressureOfWater * 10) / state.air_pressure);
          const molarMassOfMoistAir = ((1 - massFractionOfWater) * 28.966) + (massFractionOfWater * 18.015);
          const airDensity = ((state.air_pressure * 100) * molarMassOfMoistAir) / (8314.3 * (state.air_temperature + 273.15));
          value = 0.5 * airDensity * ((speed / 3.6) * (speed / 3.6)) * state.drag_coefficient * state.frontal_area;
          setResult({
            type: 'aero',
            value: value,
            speed: speed
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
      {id}
    </div>
  );
}

export default Results;