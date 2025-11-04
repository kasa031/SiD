import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/PoliticianSearchPage.css';

function PoliticianSearchPage() {
  const [politicianName, setPoliticianName] = useState('');
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!politicianName.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await api.get('/polls', {
        params: { politician_name: politicianName.trim() },
      });
      setPolls(response.data.polls);
    } catch (error) {
      console.error('Politikersøk feil:', error);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="politician-search-page">
      <div className="politician-search-card">
        <h1>Politikersøk</h1>
        <p className="description">
          Søk etter ditt navn for å se alle polls hvor du er tagget
        </p>

        <form onSubmit={handleSearch} className="politician-search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={politicianName}
              onChange={(e) => setPoliticianName(e.target.value)}
              placeholder="Skriv inn politiker-navn..."
              required
              className="search-input"
            />
            <button type="submit" className="button-blue">
              Søk
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="search-results">
          {loading ? (
            <div className="loading">Søker...</div>
          ) : (
            <>
              <h2>
                Polls for {politicianName} ({polls.length})
              </h2>
              {polls.length === 0 ? (
                <div className="no-results">
                  Ingen polls funnet for {politicianName}
                </div>
              ) : (
                <div className="polls-grid">
                  {polls.map((poll) => (
                    <Link key={poll.id} to={`/poll/${poll.id}`} className="poll-card">
                      <div className="poll-header">
                        <h2>{poll.title}</h2>
                        <span className={`location-badge ${poll.location_type}`}>
                          {poll.location_type === 'by' ? poll.location_name : 'Hele landet'}
                        </span>
                      </div>
                      {poll.description && (
                        <p className="poll-description">{poll.description}</p>
                      )}
                      <div className="poll-stats">
                        <span>{poll.options_count} alternativer</span>
                        <span>{poll.total_votes} stemmer</span>
                      </div>
                      {poll.politician_tags && poll.politician_tags.length > 0 && (
                        <div className="politician-tags">
                          {poll.politician_tags.map((tag, idx) => (
                            <span key={idx} className={`tag ${tag.toLowerCase() === politicianName.toLowerCase() ? 'highlighted' : ''}`}>
                              @{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PoliticianSearchPage;

