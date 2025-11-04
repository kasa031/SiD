import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/BadgeDisplay.css';

function BadgeDisplay({ userId }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchBadges();
    }
  }, [userId]);

  const fetchBadges = async () => {
    try {
      const response = await api.get(`/badges/user/${userId}`);
      setBadges(response.data.badges);
    } catch (error) {
      console.error('Feil ved henting av badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="badge-loading">Laster badges...</div>;
  }

  if (badges.length === 0) {
    return (
      <div className="badge-empty">
        <p>Ingen badges ennå. Start å stemme for å tjene badges!</p>
      </div>
    );
  }

  return (
    <div className="badge-display">
      <h3>Mine Badges</h3>
      <div className="badges-grid">
        {badges.map((badge) => (
          <div key={badge.id} className="badge-item">
            <div className="badge-icon">
              {badge.icon_url ? (
                <img src={badge.icon_url} alt={badge.name} />
              ) : (
                <div className="badge-placeholder">🏆</div>
              )}
            </div>
            <div className="badge-info">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
              <div className="badge-date">
                Oppnådd {new Date(badge.earned_at).toLocaleDateString('no-NO')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BadgeDisplay;
