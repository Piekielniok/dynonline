import { useState, useEffect } from 'react';
import infoModalIcon from '../assets/infoModalIcon.svg';

function AccelTable(props) {
  const [gears, setGears] = useState(props.data.number_of_gears);
  const [data, setData] = useState({
    wheel_circumference: 0,
    accel_gear: gears >= 2 ? 2 : 1,
    accel_min_rpm: 2000,
    accel_max_rpm: 5000,
    accel_interval_method: "car_speed",
    accel_intervals: [
      {
        id: 0,
        min_speed: 0,
        max_speed: 0,
        time: 0
      }
    ]
  });
  const [accelSpeed, setAccelSpeed] = useState({
    min: 0,
    max: 0,
    speed_ratio: 0
  });

  const handleIntervalData = (e, id, dataType) => {
    setData(prevState => {
      const intervals = prevState.accel_intervals.map(interval => {
        if (interval.id === id) {
          switch (dataType) {
            case "min":
              return {
                ...interval,
                min_speed: parseFloat(e.target.value)
              }
            case "max":
              return {
                ...interval,
                max_speed: parseFloat(e.target.value)
              }
            case "time":
              return {
                ...interval,
                time: parseFloat(e.target.value)
              }
          }
        }
        else return interval;
      });
      return {
        ...prevState,
        accel_intervals: intervals
      }
    });
  };

  const handleIntervalCreate = () => {
    setData(prevState => {
      const id = prevState.accel_intervals.length;
      prevState.accel_intervals.push(
        {
          id: id,
          min_speed: prevState.accel_intervals[id - 1].max_speed,
          max_speed: prevState.accel_intervals[id - 1].max_speed,
          time: 0
        }
      )
      return {
        ...prevState
      }
    });
  };

  const handleIntervalDelete = (id) => {
    setData(prevState => {
      const index = prevState.accel_intervals.findIndex(interval => interval.id === id);
      console.log(id);
      console.log(index);
      if (index > -1) {
        prevState.accel_intervals.splice(index, 1);
      }
      console.log(prevState.accel_intervals);
      return {
        ...prevState
      }
    });
  };

  useEffect(() => {
    const wheelCircumference = Math.PI * ((props.data.tyre_diameter * 2.54) + (((props.data.tyre_ratio * 2) / 100) * (props.data.tyre_width / 10)));
    setData(prevState => {
      return {
        ...prevState,
        wheel_circumference: wheelCircumference
      }
    });
  }, []);

  useEffect(() => {
    const rawMinSpeed = ((((data.accel_min_rpm / (props.data[`gear_${data.accel_gear}`] * props.data.final_drive)) * data.wheel_circumference) * 60) / 100000);
    const rawMaxSpeed = ((((data.accel_max_rpm / (props.data[`gear_${data.accel_gear}`] * props.data.final_drive)) * data.wheel_circumference) * 60) / 100000);
    const minSpeed = Math.round((rawMinSpeed + Number.EPSILON) * 10) / 10;
    const maxSpeed = Math.round((rawMaxSpeed + Number.EPSILON) * 10) / 10;
    const speedRatio = data.accel_min_rpm / rawMinSpeed;
    setAccelSpeed(prevState => {
      return {
        ...prevState,
        min: minSpeed,
        max: maxSpeed,
        speed_ratio: speedRatio
      }
    });

    if (Object.keys(data).length !== 0) {
      props.setData(data);
    }
  }, [data]);

  return (
    <div className="accel-table-container">
      <div className="accel-table-top-container">
        <span>Bieg, na którym wykonany zostanie pomiar</span>
        <img src={infoModalIcon} className="accel-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="accel-table-modal">
          Podanie tej wartości jest wymagane do wykonania obliczeń.
        </div>
      </div>
      <input type="number" min="1" max={gears} step="1" value={data.accel_gear} onChange={e => setData(prevState => { return {...prevState, [`accel_gear`]: e.target.value <= gears ? e.target.value : gears}}) }/> 
      <div className="accel-table-top-container">
        <span>Zakres prędkości obrotowej silnika</span>
        <img src={infoModalIcon} className="accel-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="accel-table-modal">
          Jest to zakres obrotów silnika, przy którym wykonywany będzie pomiar. Należy odnotować przy przyspieszaniu ile czasu pojazd potrzebował na zwiększenie prędkości o stałą wartość obrotów.
        </div>
      </div>
      <div className="accel-table-element-container">
        <input type="number" min="500" max={data.accel_max_rpm} step="100" value={data.accel_min_rpm} onChange={e => setData(prevState => { return {...prevState, [`accel_min_rpm`]: e.target.value < data.accel_max_rpm ? e.target.value : data.accel_max_rpm}}) }/>
        <span> - </span>
        <input type="number" min={data.accel_min_rpm} max="10000" step="100" value={data.accel_max_rpm} onChange={e => setData(prevState => { return {...prevState, [`accel_max_rpm`]: e.target.value > data.accel_min_rpm ? e.target.value : data.accel_min_rpm}}) }/>
      </div>
      <div className="accel-table-top-container">
        <span>Zakres prędkości pomiaru wynosi</span>
        <img src={infoModalIcon} className="accel-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="accel-table-modal">
          W zakresie prędkości uwzględniony jest większy zakres obrotów silnika, aby obliczając wartości średnie z podanych przedziałów, wykres przedstawiał odpowiedni zakres.
        </div>
      </div>
      <h2>{Math.round(((accelSpeed.min * 0.90) + Number.EPSILON) * 10) / 10} - {Math.round(((accelSpeed.max + (accelSpeed.min * 0.10)) + Number.EPSILON) * 10) / 10} <b>km/h</b></h2>
      <div className="accel-table-top-container">
        <span>Dane z przyspieszenia</span>
        <img src={infoModalIcon} className="accel-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="accel-table-modal">
          {/* Zaznacz w jakiej formie wprowadzone mają zostać dane z pomiaru: w postaci prędkości pojazdu albo prędkości obrotowej silnika, a następnie podaj czasy uzyskane w przedziałach prędkości. Im większa ilość przedziałów tym dokładniejsze bedą obliczenia. */}
          Podaj czasy uzyskane w danych przedziałach prędkości. Im większa ilość przedziałów tym dokładniejsze bedą obliczenia.
        </div>
      </div>
      <div className="accel-table-spacer"></div>
      <div className="accel-table-intervals">
        {data.accel_intervals.map(interval => {
          return (
            <div key={interval.id} className="accel-table-interval">
              <div className="accel-table-interval-container">
                <input type="number" min={accelSpeed.min} max={accelSpeed.max} step="0.1" value={interval.min_speed} onChange={e => handleIntervalData(e, interval.id, "min")}/>
                <span> - </span>
                <input type="number" min={accelSpeed.min} max={accelSpeed.max} step="0.1" value={interval.max_speed} onChange={e => handleIntervalData(e, interval.id, "max")}/>
                <span className="accel-table-interval-unit">km/h</span>
                <button onClick={e => handleIntervalDelete(interval.id)}>x</button>
                <span className="accel-table-interval-altspeed">{interval.min_speed !== accelSpeed.min ? Math.round(interval.min_speed * accelSpeed.speed_ratio) : data.accel_min_rpm} - {interval.max_speed !== accelSpeed.max ? Math.round(interval.max_speed * accelSpeed.speed_ratio) : data.accel_max_rpm} RPM</span>
                <input type="number" min="0" max="100" step="0.01" value={interval.time} onChange={e => handleIntervalData(e, interval.id, "time")}/>
                <span className="accel-table-interval-unit">s</span>
              </div>
              <div className="accel-table-spacer"></div>
            </div>
          )
        })}
        <button onClick={handleIntervalCreate}>Dodaj kolejny przedział</button>
      </div>
    </div>
  )
}

export default AccelTable;