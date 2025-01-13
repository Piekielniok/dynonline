import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-headline">Poznaj prawdziwe osiągi Twojego samochodu</h1>
      <Link className="action-btn cta-btn" to="/parametry">Przejdź do przelicznika</Link>
    </div>
  );
}

export default Home;