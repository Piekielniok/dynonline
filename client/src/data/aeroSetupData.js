const aeroSetupData = [
  {
    id: 1,
    step: 2,
    type: "",
    title: "Przy użyciu tej opcji uzyskasz w zależności od wyboru wartość lub wykres oporu powietrza czyli siły, która wyrażona jest w niutonach.",
    data: []
  },
  {
    id: 2,
    step: 3,
    type: "",
    title: "Zacznijmy od parametrów pojazdu",
    data: [
      {
        id: 1,
        type: "value",
        min: 0.1,
        max: 1,
        step: 0.01,
        default: 0.32,
        unit: "",
        name: "drag_coefficient",
        fullName: "Współczynnik oporu powietrza",
        description: "Jest to bezwymiarowa wartość zależna od kształu pojazdu, która określa jak bardzo aerodynamiczny jest pojazd.",
        altOption: false
      },
      {
        id: 2,
        type: "value",
        min: 1,
        max: 4,
        step: 0.01,
        default: 2.04,
        unit: "m²",
        name: "frontal_area",
        fullName: "Powierzchnia czołowa",
        description: "Jest to powierzchnia jaką ma samochód patrząc od jego przodu. Jeśli nie znasz tej wartości możesz wprowadzić szerokość i wysokość pojazdu żeby otrzymać orientacyjną wartość.",
        altOption: true,
        altOptionType: "checkbox",
        altOptionTitle: "Nie znam tej wartości",
        altOptionComponent: "car_width_and_height"
      }
    ]
  },
  {
    id: 3,
    step: 4,
    type: "",
    title: "Teraz podaj dane pogodowe",
    data: [
      {
        id: 1,
        type: "value",
        min: -30,
        max: 60,
        step: 1,
        default: 20,
        unit: "°C",
        name: "air_temperature",
        fullName: "Temperatura powietrza",
        description: "Należy wprowadzić temperaturę otoczenia w momencie wykonywania pomiaru.",
        altOption: false
      },
      {
        id: 2,
        type: "value",
        min: 950,
        max: 1050,
        step: 1,
        default: 1015,
        unit: "hPa",
        name: "air_pressure",
        fullName: "Ciśnienie powietrza",
        description: "Należy wprowadzić ciśnienie powietrza w momencie wykonywania pomiaru.",
        altOption: false
      },
      {
        id: 3,
        type: "value",
        min: 0,
        max: 100,
        step: 1,
        default: 30,
        unit: "%",
        name: "air_humidity",
        fullName: "Wilgotność powietrza",
        description: "Jest to wilgotność względna powietrza wyrażana w procentach, która była w momencie wykonywania pomiaru.",
        altOption: false
      }
    ]
  },
  {
    id: 4,
    step: 5,
    type: "list_select",
    title: "Dla jakiej prędkości chcesz obliczyć opór?",
    data: [
      {
        id: 1,
        name: "aero_speed_range_graph",
        fullName: "Dla zakresu prędkości",
        description: "Wprowadź zakres dla którego ma zostać wygenerowany wykres zależności oporu od prędkości pojazdu.",
        altOption: true,
        altOptionType: "",
        altOptionTitle: "",
        altOptionComponent: "speed_range"
      },
      {
        id: 2,
        name: "aero_set_speed_value",
        fullName: "Dla określonej prędkości",
        description: "Wprowadź dokładną wartość przy której ma być obliczony opór.",
        altOption: true,
        altOptionType: "",
        altOptionTitle: "",
        altOptionComponent: "speed_value"
      }
    ]
  }
  // {
  //   id: 5,
  //   step: 6,
  //   type: "",
  //   title: "Już prawie koniec. Wystarczy kliknąć dalej.",
  //   data: []
  // },
];

export default aeroSetupData;