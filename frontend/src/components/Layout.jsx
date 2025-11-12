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
      // Only clear token if it's actually invalid (401)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header" role="banner">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/" className="logo" aria-label="SiD - Gå til hjemmeside">
              SiD
            </Link>
            <nav className="nav-dropdown" role="navigation" aria-label="Hovednavigasjon">
              <Link to="/" aria-label="Gå til hjemmeside">Hjem</Link>
              <Link to="/search" aria-label="Søk etter polls">Søk</Link>
              <Link to="/stats" aria-label="Vis statistikk">Statistikk</Link>
              {user ? (
                <>
                  <Link to="/create-poll" aria-label="Opprett ny poll">Opprett Poll</Link>
                  <Link to={`/profile/${user.id}`} aria-label={`Gå til profil for ${user.username}`}>
                    Profil
                  </Link>
                  <Link to="/politician-search" aria-label="Søk etter politikere">Politikersøk</Link>
                  <button 
                    onClick={handleLogout} 
                    className="button-red"
                    aria-label="Logg ut av konto"
                  >
                    Logg ut
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" aria-label="Logg inn på konto">Logg inn</Link>
                  <Link to="/register" aria-label="Registrer ny konto">Registrer</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="main-content" role="main">
        {children}
      </main>
      <footer className="footer" role="contentinfo">
        <p>SiD - Kobler folket og politikere sammen</p>
      </footer>
    </div>
  );
}

export default Layout;

