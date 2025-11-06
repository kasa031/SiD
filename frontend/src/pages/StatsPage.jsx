import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/StatsPage.css';

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cityComparison, setCityComparison] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [selectedCategory]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await api.get('/stats/overview', { params });
      setStats(response.data);
      
      // Fetch city comparison if we have cities
      if (response.data.by_city && response.data.by_city.length > 0) {
        try {
          const topCities = response.data.by_city.slice(0, 3).map(c => c.city);
          const comparisonResponse = await api.get('/stats/city-comparison', {
            params: { cities: topCities.join(',') }
          });
          setCityComparison(comparisonResponse.data.comparison);
        } catch (e) {
          // Ignore comparison errors
          console.error('Kunne ikke hente by-sammenligning:', e);
        }
      }
    } catch (error) {
      console.error('Feil ved henting av statistikk:', error);
      window.showToast?.('Kunne ikke laste statistikk. Prøv igjen senere.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '', label: 'Alle kategorier' },
    { value: 'miljø', label: 'Miljø' },
    { value: 'helse', label: 'Helse' },
    { value: 'utdanning', label: 'Utdanning' },
    { value: 'transport', label: 'Transport' },
    { value: 'økonomi', label: 'Økonomi' },
    { value: 'sosialt', label: 'Sosialt' },
    { value: 'kultur', label: 'Kultur' },
  ];

  if (loading) {
    return <div className="loading">Laster statistikk...</div>;
  }

  if (!stats) {
    return <div className="error">Kunne ikke laste statistikk</div>;
  }

  const overview = stats.overview;

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>Statistikk og Oversikt</h1>
        <p>Se hvordan befolkningen engasjerer seg i demokratiet</p>
      </div>

      <div className="stats-filters">
        <label htmlFor="category-filter">Filtrer på kategori:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <img src={`${import.meta.env.BASE_URL}pen-ticks-paper.jpg`} alt="Polls" className="stat-icon-image" />
          </div>
          <div className="stat-value">{overview.total_polls || 0}</div>
          <div className="stat-label">Totalt antall polls</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <img src={`${import.meta.env.BASE_URL}letOurVotesBeHeard.gif`} alt="Stemmer" className="stat-icon-image" />
          </div>
          <div className="stat-value">{overview.total_votes || 0}</div>
          <div className="stat-label">Totalt antall stemmer</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <img src={`${import.meta.env.BASE_URL}emoji_satisfaction_meter.jpg`} alt="Kommentarer" className="stat-icon-image" />
          </div>
          <div className="stat-value">{overview.total_comments || 0}</div>
          <div className="stat-label">Totalt antall kommentarer</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <img src={`${import.meta.env.BASE_URL}Strongdiversity.gif`} alt="Brukere" className="stat-icon-image" />
          </div>
          <div className="stat-value">{overview.total_users || 0}</div>
          <div className="stat-label">Aktive brukere</div>
        </div>
      </div>

      {stats.by_city && stats.by_city.length > 0 && (
        <div className="section">
          <h2>Stemmer per by</h2>
          <div className="city-stats">
            {stats.by_city.map((city, idx) => (
              <div key={idx} className="city-card">
                <div className="city-name">{city.city}</div>
                <div className="city-stats-grid">
                  <div className="city-stat">
                    <span className="city-stat-value">{city.poll_count}</span>
                    <span className="city-stat-label">Polls</span>
                  </div>
                  <div className="city-stat">
                    <span className="city-stat-value">{city.vote_count}</span>
                    <span className="city-stat-label">Stemmer</span>
                  </div>
                  <div className="city-stat">
                    <span className="city-stat-value">{city.unique_voters}</span>
                    <span className="city-stat-label">Brukere</span>
                  </div>
                </div>
                <div className="city-bar">
                  <div 
                    className="city-bar-fill" 
                    style={{ 
                      width: `${(city.vote_count / (stats.by_city[0]?.vote_count || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cityComparison.length > 0 && (
        <div className="section">
          <h2>By-sammenligning</h2>
          <div className="comparison-chart">
            {cityComparison.map((city, idx) => (
              <div key={idx} className="comparison-item">
                <div className="comparison-city">{city.city}</div>
                <div className="comparison-bar-container">
                  <div 
                    className="comparison-bar"
                    style={{ 
                      width: `${(city.total_votes / Math.max(...cityComparison.map(c => c.total_votes))) * 100}%`,
                      backgroundColor: idx === 0 ? 'var(--color-blue)' : idx === 1 ? 'var(--color-green)' : 'var(--color-red)'
                    }}
                  >
                    <span className="comparison-value">{city.total_votes} stemmer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.by_category && stats.by_category.length > 0 && (
        <div className="section">
          <h2>Polls per kategori</h2>
          <div className="category-stats">
            {stats.by_category.map((cat, idx) => (
              <div key={idx} className="category-item">
                <div className="category-name">{cat.category}</div>
                <div className="category-stats-info">
                  <span>{cat.poll_count} polls</span>
                  <span>{cat.vote_count} stemmer</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-bar-fill"
                    style={{ 
                      width: `${(cat.vote_count / Math.max(...stats.by_category.map(c => c.vote_count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPage;
