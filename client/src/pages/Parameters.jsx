import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListSelect from '../components/ListSelect';
import Value from '../components/Value';
import GearsTable from '../components/GearsTable';
import AccelTable from '../components/AccelTable';
import { firstStepList } from '../data/universalSetupData';

function Parameters() {
  const navigate = useNavigate();
  const [setupSteps, setSetupSteps] = useState(1);
  const [setupOption, setSetupOption] = useState("");
  const [setupTitle, setSetupTitle] = useState("Co chcesz obliczyć?");

  const [selectedOptionData, setSelectedOptionData] = useState([]);
  const [parametersData, setParametersData] = useState({});
  const [itemsList, setItemsList] = useState([]);

  const handleParametersData = (name, value) => {
    if (typeof value === 'object') {
      setParametersData(prevState => {
        return {
          ...prevState,
          [name]: value.name
        }
      });
    }
    else {
      setParametersData(prevState => {
        return {
          ...prevState,
          [name]: value !== "" ? parseFloat(value) : 0
        }
      });
    }
  };

  const handleParametersAltData = (data) => {
    for (let key in data) {
      if (!data.hasOwnProperty(key)) continue;
      setParametersData(prevState => {
        return {
          ...prevState,
          [key]: data[key] !== "" ? parseFloat(data[key]) : 0
        }
      });
    }
  };

  const handleParametersAccelData = () => {
    for (let key in data) {
      if (!data.hasOwnProperty(key)) continue;
      setParametersData(prevState => {
        return {
          ...prevState,
          [key]: data[key]
        }
      });
    }
  }

  const handleItemsData = (step) => {
    switch (step.type) {
      case "":
        const items = step.data.map(item =>
          <Value key={item.name} item={item} setData={handleParametersData} setAltData={handleParametersAltData} />
        );
        setItemsList(items);
        break;
      case "list_select":
        setItemsList([<ListSelect key={step.id} stepID={step.id} list={step.data} setData={handleParametersData} setAltData={handleParametersAltData} />]);
        break;
      case "gears_table":
        setItemsList([<GearsTable key={step.id} setData={handleParametersAltData} />]);
        break;
      case "accel_table":
        setItemsList([<AccelTable key={step.id} data={parametersData} setData={handleParametersAccelData} />]);
    }
  };

  const handleNextStep = () => {
    if (setupSteps === 1) {
      switch (setupOption) {
        case 1:
          import("../data/powerGraphSetupData").then(data => {
            setSelectedOptionData(data.default);
            setSetupSteps(data.default[0].step);
            setSetupTitle(data.default[0].title);
            setParametersData({ option: "powerGraph" });
            handleItemsData(data.default[0]);
          });
          break;
        case 2:
          break;
        case 3:
          import("../data/aeroSetupData").then(data => {
            setSelectedOptionData(data.default);
            setSetupSteps(data.default[0].step);
            setSetupTitle(data.default[0].title);
            setParametersData({ option: "aero" });
            handleItemsData(data.default[0]);
          });
          break;
        case 4:
          import("../data/rollSetupData").then(data => {
            setSelectedOptionData(data.default);
            setSetupSteps(data.default[0].step);
            setSetupTitle(data.default[0].title);
            setParametersData({ option: "roll" });
            handleItemsData(data.default[0]);
          });
          break;
      }
    }
    else {
      const prevStepDataIndex = selectedOptionData.findIndex(el => el.step === setupSteps);
      if (prevStepDataIndex !== -1 && prevStepDataIndex < selectedOptionData.length - 1) {
        setSetupSteps(selectedOptionData[prevStepDataIndex + 1].step);
        setSetupTitle(selectedOptionData[prevStepDataIndex + 1].title);
        handleItemsData(selectedOptionData[prevStepDataIndex + 1]);
      }
      else if (prevStepDataIndex === selectedOptionData.length - 1) {
        //przejdz do wyliczen
        // console.log("koniec");
        navigate('/wynik', { state: parametersData });

      }
      else {
        setSetupSteps(selectedOptionData[0].step);
      }
    }

    // selectedOptionData.forEach(el => {
    //   setSetupSteps()
    // });
  };

  const handleSetupOption = (stepID, item) => {
    setSetupOption(item.id);
  }

  useEffect(() => {
    console.log(parametersData);
  }, [parametersData]);

  return (
    <>
      <div className="parameters-container">
        <h1 className={`parameters-title ${setupSteps === 1 ? 'title-first-step' : ''}`}>{setupTitle}</h1>
        {setupSteps === 1 ? <ListSelect stepID={1} list={firstStepList} setData={handleSetupOption} setAltData={handleParametersAltData} /> : ''}
        {itemsList.length > 0 ? itemsList : ''}
      </div>
      <div className="parameters-actionbar">
        <span>Krok <b>{setupSteps}</b></span>
        <button onClick={handleNextStep}>Dalej</button>
      </div>
    </>
  );
}

export default Parameters;