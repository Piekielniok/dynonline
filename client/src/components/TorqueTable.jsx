import { useState, useEffect } from 'react';
import infoModalIcon from '../assets/infoModalIcon.svg';

function TorqueTable(props) {
  const [data, setData] = useState({
    wheel_circumference: 0,
    torque_interval_method: "table",
    torque_intervals: [
      {
        id: 0,
        torque: 100,
        rpm: 1500
      }
    ]
  });

  const handleIntervalData = (e, id, dataType) => {
    setData(prevState => {
      const intervals = prevState.torque_intervals.map(interval => {
        if (interval.id === id) {
          switch (dataType) {
            case "torque":
              return {
                ...interval,
                torque: parseFloat(e.target.value)
              }
            case "rpm":
              return {
                ...interval,
                rpm: parseFloat(e.target.value)
              }
          }
        }
        else return interval;
      });
      return {
        ...prevState,
        torque_intervals: intervals
      }
    });
  };

  const handleIntervalCreate = () => {
    setData(prevState => {
      const id = prevState.torque_intervals.length;
      prevState.torque_intervals.push(
        {
          id: id,
          torque: prevState.torque_intervals[id - 1].torque,
          rpm: prevState.torque_intervals[id - 1].rpm + 100
        }
      )
      return {
        ...prevState
      }
    });
  };

  const handleIntervalDelete = (id) => {
    setData(prevState => {
      const index = prevState.torque_intervals.findIndex(interval => interval.id === id);
      if (index > -1) {
        prevState.torque_intervals.splice(index, 1);
      }
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
    if (Object.keys(data).length !== 0) {
      props.setData(data);
    }
  }, [data]);

  return (
    <div className="torque-table-container">
      <div className="torque-table-top-container">
        <span>Dane momentu obrotowego</span>
        <img src={infoModalIcon} className="torque-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="torque-table-modal">
          {/* Zaznacz w jakiej formie wprowadzone mają zostać dane z pomiaru: w postaci prędkości pojazdu albo prędkości obrotowej silnika, a następnie podaj czasy uzyskane w przedziałach prędkości. Im większa ilość przedziałów tym dokładniejsze bedą obliczenia. */}
          Podaj wartości momentu obrotowego uzyskane przy danych obrotach. Im większa ilość przedziałów tym dokładniejsze bedą obliczenia.
        </div>
      </div>
      <div className="torque-table-spacer"></div>
      <div className="torque-table-intervals">
        {data.torque_intervals.map(interval => {
          return (
            <div key={interval.id} className="torque-table-interval">
              <div className="torque-table-interval-container">
                <input type="number" min="0" max="5000" step="0.1" value={interval.torque} onChange={e => handleIntervalData(e, interval.id, "torque")}/>
                <span className="torque-table-interval-unit">Nm</span>
                <button onClick={e => handleIntervalDelete(interval.id)}>x</button>
                <span>przy</span>
                <input type="number" min="0" max="10000" step="1" value={interval.rpm} onChange={e => handleIntervalData(e, interval.id, "rpm")}/>
                <span className="torque-table-interval-unit">RPM</span>
              </div>
              <div className="torque-table-spacer"></div>
            </div>
          )
        })}
        <button onClick={handleIntervalCreate}>Dodaj kolejny przedział</button>
      </div>
    </div>
  )
}

export default TorqueTable;