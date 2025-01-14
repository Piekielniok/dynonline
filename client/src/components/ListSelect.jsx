import { useState, useEffect } from 'react';
import infoModalIcon from '../assets/infoModalIcon.svg';

function ListSelect(props) {
  const [selectedOption, setSelectedOption] = useState(1);
  const [altData, setAltData] = useState({
    set_speed: 50,
    speed_range_min: 0,
    speed_range_max: 200
  });

  const handleAltDataChange = (name, value) => {
    setAltData(prevState => {
      return {
        ...prevState,
        [name]: value
      }
    });
  };

  const listItems = props.list.map(item => {
    let component;

    switch (item.altOptionComponent) {
      case 'speed_value':
        component = (
          <div className='list-select-alt-container' style={{opacity: 1}}>
            <span className='list-select-alt-title'>Prędkość</span>
            <input type="number" min="0" max="500" step="1" value={altData.set_speed || ''} onChange={e => handleAltDataChange("set_speed", e.target.value)} />
            <span className='list-select-unit'>km/h</span>
          </div>
        );
        break;
      case 'speed_range':
        component = (
          <div className='list-select-alt-container' style={{opacity: 1}}>
            <span className='list-select-alt-title'>Prędkość</span>
            <input type="number" min="0" max={altData.speed_range_max} step="1" value={altData.speed_range_min || 0} onChange={e => handleAltDataChange("speed_range_min", e.target.value)} />
            <span> - </span>
            <input type="number" min={altData.speed_range_min} max="500" step="1" value={altData.speed_range_max || 200} onChange={e => handleAltDataChange("speed_range_max", e.target.value)} />
            <span className='list-select-unit'>km/h</span>
          </div>
        )
        break;
      default:
        component = '';
        break;
    }

    return (
      <div key={item.name} className="list-select-element">
        <div className="list-select-element-container">
          <button
            className={selectedOption === item.id ? 'selected' : ''}
            onClick={e => setSelectedOption(item.id)}
          >
            {item.fullName}
          </button>
          <img src={infoModalIcon} className="list-select-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
          <div className="list-select-modal">
            {item.description}
          </div>
        </div>
        {selectedOption === item.id ? component : ''}
      </div>
    )
  });

  useEffect(() => {
    document.querySelectorAll('.list-select-element').forEach(el => {
      el.querySelector('.list-select-info').classList.contains('opened') ? el.querySelector('.opened').classList.remove('opened') : '';
    });
    if (props.setData !== undefined) {
      props.setData(`step_${props.stepID}_option`, props.list[selectedOption - 1]);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (Object.keys(altData).length !== 0) {
      props.setAltData(altData);
    }
  }, [altData]);

  return (
    <div className='list-select'>
      {listItems}
    </div>
  );
}

export default ListSelect;