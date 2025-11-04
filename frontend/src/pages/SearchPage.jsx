import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/SearchPage.css';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationType, setLocationType] = useState('');
  const [locationName, setLocationName] = useState('');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    performSearch();
  }, [locationType, locationName]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (locationType) params.location_type = locationType;
      if (locationName) params.location_name = locationName;

      const response = await api.get('/polls', { params });
      setPolls(response.data.polls);
    } catch (error) {
      console.error('Søkefeil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div className="search-page">
      <h1>Søk i polls</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Søk i tittel eller beskrivelse..."
            className="search-input"
          />
          <button type="submit" className="button-blue">Søk</button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="locationType">Område</label>
            <select
              id="locationType"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <option value="">Alle områder</option>
              <option value="land">Hele landet</option>
              <option value="by">Spesifikk by</option>
            </select>
          </div>

          {locationType === 'by' && (
            <div className="filter-group">
              <label htmlFor="locationName">Bynavn</label>
              <input
                type="text"
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="f.eks. Oslo, Bergen"
              />
            </div>
          )}
        </div>
      </form>

      {loading ? (
        <div className="loading">Søker...</div>
      ) : (
        <div className="search-results">
          <h2>Resultater ({polls.length})</h2>
          {polls.length === 0 ? (
            <div className="no-results">Ingen polls funnet</div>
          ) : (
            <div className="polls-grid">
              {polls.map((poll) => (
                <Link key={poll.id} to={`/poll/${poll.id}`} className="poll-card">
                  <div className="poll-header">
                    <h2>{poll.title}</h2>
                    <span className={`location-badge ${poll.location_type}`}>
                      {poll.location_type === 'by' ? `📍 ${poll.location_name}` : '🇳🇴 Hele landet'}
                    </span>
                  </div>
                  {poll.description && (
                    <p className="poll-description">{poll.description}</p>
                  )}
                  <div className="poll-stats">
                    <span>{poll.options_count} alternativer</span>
                    <span>{poll.total_votes} stemmer</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;

