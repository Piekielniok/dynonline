import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './css/reset.css';
import './css/App.css';
import blankAvatar from './assets/blankAvatar.svg';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Parameters = lazy(() => import('./pages/Parameters'));
const Results = lazy(() => import('./pages/Results'));

function App() {
  //const [count, setCount] = useState(0);

  return (
    <Router>
      <nav className="nav-bar">
        <Link className="logo" to="/"><b>DYN</b>ONLINE</Link>
        <Link to="/login">
          <img src={blankAvatar} />
        </Link>
      </nav>
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/parametry" element={<Parameters />} />
          <Route path="/wynik" element={<Results />} />
          <Route path="/wynik/:id" element={<Results />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
