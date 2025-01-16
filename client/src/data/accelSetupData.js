const accelSetupData = [
  {
    id: 1,
    step: 2,
    type: "",
    title: "Opcja ta pozwala obliczyć przyspieszenie samochodu od 0 do 100 km/h. Do obliczeń wymagane będą wartości z wykresu z hamowni, który znaleźć można także w sieci.",
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
        min: 300,
        max: 15000,
        step: 1,
        default: 1500,
        unit: "kg",
        name: "car_weight",
        fullName: "Masa pojazdu",
        description: "Jest to masa jaką posiada samochód w momencie pomiaru wraz z kierowcą, płynami eksploatacyjnymi oraz wszystkimi akcesoriami.",
        altOption: false
      },
      {
        id: 2,
        type: "value",
        min: 0.1,
        max: 1,
        step: 0.01,
        default: 0.32,
        unit: "",
        name: "drag_coefficient",
        fullName: "Współczynnik oporu powietrza",
        description: "Jest to wartość która określa jak bardzo aerodynamiczny jest samochód",
        altOption: false
      },
      {
        id: 3,
        type: "value",
        min: 1,
        max: 4,
        step: 0.01,
        default: 2.04,
        unit: "m²",
        name: "frontal_area",
        fullName: "Powierzchnia czołowa",
        description: "Jest to powierzchnia jaką ma samochód patrząc od jego przodu. Jeśli nie znasz tej wartości możesz wprowadzić szerokość i wysokość pojazdu żeby otrzymać orientacyjną wartość",
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
    title: "Przejdźmy do parametrów opon",
    data: [
      {
        id: 1,
        type: "value",
        min: 85,
        max: 405,
        step: 5,
        default: 205,
        unit: "mm",
        name: "tyre_width",
        fullName: "Szerokość opony",
        description: "",
        altOption: false
      },
      {
        id: 2,
        type: "value",
        min: 10,
        max: 90,
        step: 5,
        default: 55,
        unit: "",
        name: "tyre_ratio",
        fullName: "Profil opony",
        description: "",
        altOption: false
      },
      {
        id: 3,
        type: "value",
        min: 10,
        max: 25,
        step: 1,
        default: 16,
        unit: "\"",
        name: "tyre_diameter",
        fullName: "Średnica felgi",
        description: "",
        altOption: false
      },
      {
        id: 4,
        type: "value",
        min: 0.1,
        max: 6,
        step: 0.1,
        default: 2.5,
        unit: "bar",
        name: "tyre_pressure",
        fullName: "Ciśnienie opon",
        description: "",
        altOption: false
      }
    ]
  },
  {
    id: 4,
    step: 5,
    type: "gears_table",
    title: "Podaj przełożenia biegów",
    data: []
  },
  {
    id: 5,
    step: 6,
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
        description: "Jest to temperatura",
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
        description: "Jest to ciśnienie",
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
        description: "Jest to wilgotność którą odczuwamy",
        altOption: false
      }
    ]
  },
  {
    id: 6,
    step: 7,
    type: "torque_table",
    title: "Pora na wprowadzenie danych z wykresu z hamowni",
    data: []
  },
  {
    id: 7,
    step: 8,
    type: "",
    title: "Już prawie koniec. Ta strona zawiera modyfikatory, których nie musisz zmieniać jeśli nie jesteś pewien.",
    data: [
      {
        id: 1,
        type: "value",
        min: 0,
        max: 20,
        step: 0.01,
        default: 0.8,
        unit: "s",
        name: "gear_change_time",
        fullName: "Czas zmiany biegów",
        description: "",
        altOption: false
      }
    ]
  },
];

export default accelSetupData;