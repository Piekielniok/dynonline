import { useState, useEffect } from 'react';
import infoModalIcon from '../assets/infoModalIcon.svg';

function GearsTable(props) {
  const [data, setData] = useState({
    number_of_gears: 5
  });
  let gearsList = [];

  const handleDataChange = (gear, value) => {
    setData(prevState => {
      return {
        ...prevState,
        [`gear_${gear}`]: value
      }
    });
  };

  for (let i = 1; i <= data.number_of_gears; i++) {
    gearsList.push(
      <div key={i} className="gears-table-element">
        <span>{i}. bieg</span>
        <input type="number" min="0" max="10" step="0.01" value={data[`gear_${i}`] || ''} onChange={e => handleDataChange(i, e.target.value)}/>
      </div>
    );
  }

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      props.setData(data);
    }
  }, [data]);

  return (
    <div className="gears-table-container">
      <div className="gears-table-top-container">
        <span>Podaj liczbę biegów</span>
        <img src={infoModalIcon} className="gears-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="gears-table-modal">
          Liczba przełożeń jaką posiada skrzynia biegów w samochodzie, za wyjątkiem biegu wstecznego.
        </div>
      </div>
      <input type="number" min="1" max="20" step="1" value={data.number_of_gears} onChange={e => setData(prevState => { return {...prevState, [`number_of_gears`]: e.target.value}}) }/> 
      <span>Podaj przełożenia</span>
      {gearsList}
      <div className="gears-table-top-container">
        <span>Przełożenie końcowe</span>
        <img src={infoModalIcon} className="gears-table-info" onClick={e => e.target.classList.contains('opened') ? e.target.classList.remove('opened') : e.target.classList.add('opened')} />
        <div className="gears-table-modal">
          Przełożenie to określa ile obrotów musi wykonać wyjście ze skrzyni biegów, aby koła zrobiły jeden obrót.
        </div>
      </div>
      <input type="number" min="0" max="10" step="0.01" value={data[`final_drive`] || ''} onChange={e => setData(prevState => { return {...prevState, [`final_drive`]: e.target.value}}) }/>
    </div>
  )
}

export default GearsTable;