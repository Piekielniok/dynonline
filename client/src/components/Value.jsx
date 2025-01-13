import { useState, useEffect } from 'react';
import infoModalIcon from '../assets/infoModalIcon.svg';

function Value(props) {
  const [data, setData] = useState(props.item.default != "" ? props.item.default : 0);
  const [altData, setAltData] = useState({});

  const handleAltOption = () => {
    let component;

    switch (props.item.altOptionComponent) {
      case 'car_width_and_height':
        component = (
          <div className='value-alt-options'>
            <span className='value-alt-title'>Szerokość</span>
            <input type="number" min="0" max="2.6" step="0.01" value={altData.car_width || ''} placeholder='1.7' onChange={e => handleAltDataChange("car_width", e.target.value)}></input>
            <span className='value-unit'>m</span>
            <span className='value-alt-title'>Wysokość</span>
            <input type="number" min="0" max="4" step="0.01" value={altData.car_height || ''} placeholder='1.4' onChange={e => handleAltDataChange("car_height", e.target.value)}></input>
            <span className='value-unit'>m</span>
          </div>
        );
        break;
      default:
        component = '';
        break;
    }

    return (
      <div className='value-alt-container'>
        <input type={props.item.altOptionType} onChange={e => !e.target.checked ? Object.keys(altData).forEach(function(key) { setAltData(prevState => { return {...prevState, [key]: 0}}) }) : ''}></input>
        <span>{props.item.altOptionTitle}</span>
        {component}
      </div>
    )
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const handleAltDataChange = (name, value) => {
    setAltData(prevState => {
      return {
        ...prevState,
        [name]: value
      }
    });
  };

  useEffect(() => {
    props.setData(props.item.name, data);

    if (Object.keys(altData).length !== 0) {
      props.setAltData(altData);
    }
  }, [data, altData]);

  return (
    <div className='value-element'>
      <div className='value-top-container'>
        <span>{props.item.fullName}</span>
        <img src={infoModalIcon} className="value-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="value-modal">
          {props.item.description}
        </div>
      </div>
      <div className='value-bottom-container'>
        <input type="number" min={props.item.min !== "" ? props.item.min : ''} max={props.item.max !== "" ? props.item.max : ''} step={props.item.step !== "" ? props.item.step : 0.01} value={data} onChange={handleDataChange}/>
        {props.item.unit != "" ? <span className='value-unit'>{props.item.unit}</span> : ''}
      </div>
      {props.item.altOption ? handleAltOption() : ''}
    </div>
  );
}

export default Value;