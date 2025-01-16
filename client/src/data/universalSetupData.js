export const firstStepList = [
  {
    id: 1,
    name: "graph",
    fullName: "Moc oraz moment obrotowy",
    description: "Wybór tej opcji pozwoli wygenerować wykres mocy oraz momentu obrotowego w zależności od obrotów silnika. W celu uzyskania dokładnego wykresu, wymagany jest pomiar przyspieszenia wraz z obrotami silnika / prędkością pojazdu.",
    altOption: false
  },
  {
    id: 2,
    name: "accel",
    fullName: "Przyspieszenie pojazdu",
    description: "Opcja ta pozwala obliczyć przyspieszenie pojazdu od 0 do 100 km/h. Do obliczenia tej wartości potrzebne są dane z wykresu z hamowni.",
    // description: "Opcja ta pozwala na uzyskanie wartości przyspieszenia dla zakresów takich jak 0 - 100 km/h, 100 - 200 km/h, 80 - 120 km/h oraz dla odległości takich jak 1/8 mili, 1/4 mili i 1000 m. Dodatkowo obliczona zostanie prędkość maksymalna.",
    altOption: false
  },
  {
    id: 3,
    name: "aero",
    fullName: "Opór powietrza",
    description: "Za pomocą tej opcji można uzyskać wartość siły oporu powietrza oddziałującej na samochód dla określonej prędkości oraz można wygenerować wykres dla określonego zakresu prędkości.",
    altOption: false
  },
  {
    id: 4,
    name: "roll",
    fullName: "Opór toczenia",
    description: "Opcja ta pozwala na obliczenie siły oporu toczenia zależnej od masy pojazdu oraz ciśnienia w oponach.",
    // description: "Opcja ta pozwala na obliczenie siły oporu toczenia zależnej od rodzaju opon oraz nawierzchni drogi. Wartość ta ma bezpośredni wpływ na zużycie paliwa oraz prędkość maksymalną samochodu.",
    altOption: false
  }
];

// {
//   id: 5,
//   name: "all",
//   fullName: "Pełny zakres danych",
//   description: "",
//   altOption: false
// }