import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import '../styles/PollDetailPage.css';

function PollDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPoll();
    fetchComments();
    checkVoteStatus();
    checkUser();
  }, [id]);

  const checkUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  };

  const fetchPoll = async () => {
    try {
      const response = await api.get(`/polls/${id}`);
      setPoll(response.data.poll);
    } catch (error) {
      console.error('Feil ved henting av poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/poll/${id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Feil ved henting av kommentarer:', error);
    }
  };

  const checkVoteStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.get(`/votes/${id}/status`);
      setHasVoted(response.data.has_voted);
      setSelectedOption(response.data.option_id);
    } catch (error) {
      // Ignore if not logged in
    }
  };

  const handleVote = async (optionId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (hasVoted) {
      alert('Du har allerede stemt på denne poll');
      return;
    }

    try {
      await api.post(`/votes/${id}`, { option_id: optionId });
      setHasVoted(true);
      setSelectedOption(optionId);
      fetchPoll(); // Refresh poll to get updated vote counts
    } catch (error) {
      alert(error.response?.data?.error || 'Feil ved stemmegiving');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/comments/poll/${id}`, { content: newComment });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      alert(error.response?.data?.error || 'Feil ved opprettelse av kommentar');
    }
  };

  if (loading) {
    return <div className="loading">Laster poll...</div>;
  }

  if (!poll) {
    return <div className="error">Poll ikke funnet</div>;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);

  return (
    <div className="poll-detail-page">
      <div className="poll-detail-card">
        <div className="poll-detail-header">
          <h1>{poll.title}</h1>
          <span className={`location-badge ${poll.location_type}`}>
            {poll.location_type === 'by' ? `📍 ${poll.location_name}` : '🇳🇴 Hele landet'}
          </span>
        </div>

        {poll.description && (
          <p className="poll-description">{poll.description}</p>
        )}

        {poll.politician_tags && poll.politician_tags.length > 0 && (
          <div className="politician-tags">
            <strong>Politikere:</strong>
            {poll.politician_tags.map((tag, idx) => (
              <span key={idx} className="tag">@{tag}</span>
            ))}
          </div>
        )}

        <div className="poll-options">
          <h2>Alternativer</h2>
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes_count / totalVotes) * 100 : 0;
            const isSelected = selectedOption === option.id;
            const canVote = !hasVoted && user;

            return (
              <div key={option.id} className={`option-item ${isSelected ? 'selected' : ''}`}>
                <div className="option-header">
                  <button
                    className={`vote-button ${canVote ? 'button-blue' : 'disabled'}`}
                    onClick={() => handleVote(option.id)}
                    disabled={!canVote}
                  >
                    {isSelected ? '✓ Stemt' : canVote ? 'Stem' : 'Logg inn for å stemme'}
                  </button>
                  <span className="option-text">{option.option_text}</span>
                </div>
                {hasVoted && (
                  <div className="vote-bar-container">
                    <div
                      className="vote-bar"
                      style={{ width: `${percentage}%`, backgroundColor: isSelected ? 'var(--color-green)' : 'var(--color-blue)' }}
                    />
                    <span className="vote-percentage">{percentage.toFixed(1)}% ({option.votes_count} stemmer)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="poll-meta">
          <p>Opprettet av: {poll.creator_username}</p>
          <p>Totalt antall stemmer: {totalVotes}</p>
        </div>
      </div>

      <div className="comments-section">
        <h2>Kommentarer ({comments.length})</h2>
        
        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Skriv en kommentar..."
              rows="3"
              required
            />
            <button type="submit" className="button-green">Legg til kommentar</button>
          </form>
        ) : (
          <p className="login-prompt">
            <a href="/login">Logg inn</a> for å legge til kommentarer
          </p>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <img
                  src={getAvatarUrl(comment.profile_picture_url)}
                  alt={comment.username}
                  className="comment-avatar"
                  onError={(e) => {
                    e.target.src = getAvatarUrl();
                  }}
                />
                <div>
                  <strong>{comment.username}</strong>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString('no-NO')}
                  </span>
                </div>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PollDetailPage;

