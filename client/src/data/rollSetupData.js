const aeroSetupData = [
  {
    id: 1,
    step: 2,
    type: "",
    title: "Użycie tej opcji pozwoli uzyskać w zależności od wyboru wartość lub wykres oporu toczenia, czyli siły wyrażonej w Newtonach.",
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
        min: 0.1,
        max: 6,
        step: 0.1,
        default: 2.5,
        unit: "bar",
        name: "tyre_pressure",
        fullName: "Ciśnienie opon",
        description: "",
        altOption: false
      },
      {
        id: 2,
        type: "value",
        min: 1,
        max: 5,
        step: 1,
        default: 3,
        unit: "",
        name: "tyre_class",
        fullName: "Klasa efektywności paliwowej opony",
        description: "Informacje o klasie efektywności można znaleźć na etykiecie na oponie. Według zmian w etykietach opon wprowadzonych w 2021 roku, skala wynosi od A do E. 1 = A, 6 = E",
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
        name: "roll_all_speed_graph",
        fullName: "Dla wszystkich prędkości",
        altOption: false
      },
      {
        id: 2,
        name: "roll_set_speed_value",
        fullName: "Dla określonej prędkości",
        altOption: true,
        altOptionType: "",
        altOptionTitle: "",
        altOptionComponent: "speed_value"
      }
    ]
  },
  {
    id: 5,
    step: 6,
    type: "",
    title: "Już prawie koniec. Wystarczy kliknąć dalej.",
    data: []
  },
];

export default aeroSetupData;