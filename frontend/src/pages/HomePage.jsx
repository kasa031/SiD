import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import InspirationBanner from '../components/InspirationBanner';
import { formatRelativeTime } from '../utils/date';
import { getCategoryLabel } from '../utils/categories';
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
      window.showToast?.('Kunne ikke laste polls. Prøv igjen senere.', 'error');
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
            <h1>Velkommen til SiD</h1>
            <p>En plattform som kobler folket og politikere sammen gjennom meningsmålinger og dialog</p>
            <p className="hero-subtitle">Din stemme teller. La din mening bli hørt.</p>
          </div>
          <div className="hero-image">
            <img 
              src={`${import.meta.env.BASE_URL}survey-poster.jpg`} 
              alt="SiD og meningsmålinger" 
              loading="lazy"
              decoding="async"
            />
            <div className="hero-gif">
              <img 
                src={`${import.meta.env.BASE_URL}Democracy.gif`} 
                alt="Demokrati" 
                className="hero-gif-overlay"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <InspirationBanner />

      <div className="polls-grid">
        {polls.length === 0 ? (
          <div className="no-polls">
            <img 
              src={`${import.meta.env.BASE_URL}checklist-paper-green-tick.jpg`} 
              alt="Ingen polls" 
              className="empty-state-image"
              loading="lazy"
              decoding="async"
            />
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
                      {getCategoryLabel(poll.category)}
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
              {poll.category && (
                <div className="poll-category">
                  <span className="category-badge">
                    {getCategoryLabel(poll.category)}
                  </span>
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

