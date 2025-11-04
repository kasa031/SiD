import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Layout.css';

function Layout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            🗳️ Polls
          </Link>
          <nav className="nav">
            <Link to="/">Hjem</Link>
            <Link to="/search">Søk</Link>
            {user ? (
              <>
                <Link to="/create-poll">Opprett Poll</Link>
                <Link to={`/profile/${user.id}`}>Profil</Link>
                <Link to="/politician-search">Politikersøk</Link>
                <button onClick={handleLogout} className="button-red">
                  Logg ut
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Logg inn</Link>
                <Link to="/register">Registrer</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>Polls Nettside - Kobler folket og politikere sammen</p>
      </footer>
    </div>
  );
}

export default Layout;

