import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRelativeTime } from '../utils/date';
import '../styles/HomePage.css';

function HomePage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await api.get('/polls');
      setPolls(response.data.polls);
    } catch (error) {
      console.error('Feil ved henting av polls:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Laster polls..." />;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Velkommen til Polls</h1>
            <p>En plattform som kobler folket og politikere sammen gjennom meningsmålinger og dialog</p>
            <p className="hero-subtitle">Din stemme teller. La din mening bli hørt.</p>
          </div>
          <div className="hero-image">
            <img src="/survey-poster.jpg" alt="Polls og meningsmålinger" />
            <div className="hero-gif">
              <img src="/Democracy.gif" alt="Demokrati" className="hero-gif-overlay" />
            </div>
          </div>
        </div>
      </div>

      <div className="polls-grid">
        {polls.length === 0 ? (
          <div className="no-polls">
            <img src="/checklist-paper-green-tick.jpg" alt="Ingen polls" className="empty-state-image" />
            <p>Ingen polls ennå. Vær den første til å opprette en!</p>
          </div>
        ) : (
          polls.map((poll) => (
            <Link key={poll.id} to={`/poll/${poll.id}`} className="poll-card">
              <div className="poll-header">
                <h2>{poll.title}</h2>
                <div className="poll-badges">
                  <span className={`location-badge ${poll.location_type}`}>
                    {poll.location_type === 'by' ? poll.location_name : 'Hele landet'}
                  </span>
                  {poll.category && (
                    <span className="category-badge">
                      {poll.category === 'miljo' ? 'Miljø' :
                       poll.category === 'samfunn' ? 'Samfunn' :
                       poll.category === 'helse' ? 'Helse' :
                       poll.category === 'utdanning' ? 'Utdanning' :
                       poll.category === 'transport' ? 'Transport' :
                       poll.category === 'okonomi' ? 'Økonomi' :
                       poll.category === 'politikk' ? 'Politikk' :
                       poll.category === 'kultur' ? 'Kultur' : poll.category}
                    </span>
                  )}
                </div>
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
                    <span key={idx} className="tag">@{tag}</span>
                  ))}
                </div>
              )}
              <div className="poll-creator">
                <span>Av {poll.creator_username}</span>
                <span className="poll-date">{formatRelativeTime(poll.created_at)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;

