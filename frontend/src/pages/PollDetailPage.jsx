import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import { validateComment } from '../utils/validation';
import { getCategoryLabel } from '../utils/categories';
import { sharePollWithFallback, copyPollLink } from '../utils/share';
import { trackEvent } from '../utils/analytics';
import { exportPollToCSV, exportPollToPDF } from '../utils/export';
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
  const [isOwner, setIsOwner] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    fetchPoll();
    fetchComments();
    checkVoteStatus();
    checkUser();
    checkIsOwner();
  }, [id, user]);

  const checkUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  };

  const checkIsOwner = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsOwner(false);
      return;
    }

    try {
      const response = await api.get(`/polls/${id}/is-owner`);
      setIsOwner(response.data.is_owner);
    } catch (error) {
      setIsOwner(false);
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
      window.showToast?.('Du har allerede stemt på denne poll', 'warning');
      return;
    }

    try {
      await api.post(`/votes/${id}`, { option_id: optionId });
      setHasVoted(true);
      setSelectedOption(optionId);
      fetchPoll(); // Refresh poll to get updated vote counts
      window.showToast?.('Stemme registrert!', 'success');
      
      // Track vote in analytics
      trackEvent('vote_cast', {
        poll_id: id,
        option_id: optionId,
      });
      
      // Check for badges
      try {
        await api.post('/badges/check');
      } catch (e) {
        // Ignore badge check errors
      }
    } catch (error) {
      window.showToast?.(error.response?.data?.error || 'Feil ved stemmegiving', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const commentError = validateComment(newComment);
    if (commentError) {
      window.showToast?.(commentError, 'error');
      return;
    }

    try {
      const response = await api.post(`/comments/poll/${id}`, { content: newComment });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      window.showToast?.('Kommentar lagt til', 'success');
      
      // Check for badges
      try {
        await api.post('/badges/check');
      } catch (e) {
        // Ignore badge check errors
      }
    } catch (error) {
      window.showToast?.(error.response?.data?.error || 'Feil ved opprettelse av kommentar', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Laster poll...</div>;
  }

  if (!poll) {
    return <div className="error">Poll ikke funnet</div>;
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);

  const handleShare = async () => {
    await sharePollWithFallback(id, poll.title);
    trackEvent('poll_shared', {
      poll_id: id,
      poll_title: poll.title,
    });
  };

  const handleCopyLink = async () => {
    await copyPollLink(id, poll.title);
    trackEvent('poll_link_copied', {
      poll_id: id,
    });
  };

  const handleExportCSV = () => {
    exportPollToCSV(poll, poll.options);
    trackEvent('poll_exported', {
      poll_id: id,
      format: 'csv',
    });
  };

  const handleExportPDF = async () => {
    await exportPollToPDF(poll, poll.options);
    trackEvent('poll_exported', {
      poll_id: id,
      format: 'pdf',
    });
  };

  const handleDeletePoll = async () => {
    if (!window.confirm('Er du sikker på at du vil slette denne poll? Denne handlingen kan ikke angres.')) {
      return;
    }

    try {
      await api.delete(`/polls/${id}`);
      window.showToast?.('Poll slettet', 'success');
      navigate('/');
    } catch (error) {
      window.showToast?.(error.response?.data?.error || 'Feil ved sletting av poll', 'error');
    }
  };

  const handleReportPoll = async (e) => {
    e.preventDefault();
    if (!reportReason) {
      window.showToast?.('Velg en grunn for rapportering', 'error');
      return;
    }

    try {
      await api.post(`/polls/${id}/report`, {
        reason: reportReason,
        description: reportDescription,
      });
      window.showToast?.('Poll rapportert. Takk for din tilbakemelding.', 'success');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      window.showToast?.(error.response?.data?.error || 'Feil ved rapportering av poll', 'error');
    }
  };

  return (
    <div className="poll-detail-page">
      <div className="poll-detail-card">
        <div className="poll-detail-header">
          <div className="poll-header-content">
            <h1>{poll.title}</h1>
            <div className="poll-header-actions">
              <span className={`location-badge ${poll.location_type}`}>
                {poll.location_type === 'by' ? poll.location_name : 'Hele landet'}
              </span>
              <button
                onClick={handleShare}
                className="button-secondary share-button"
                aria-label="Del denne poll"
                title="Del poll"
              >
                📤 Del
              </button>
              <button
                onClick={handleCopyLink}
                className="button-secondary copy-link-button"
                aria-label="Kopier lenke til poll"
                title="Kopier lenke"
              >
                🔗 Kopier lenke
              </button>
              {user && !isOwner && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="button-secondary report-button"
                  aria-label="Rapporter poll"
                  title="Rapporter uønsket innhold"
                >
                  ⚠️ Rapporter
                </button>
              )}
              {isOwner && (
                <button
                  onClick={handleDeletePoll}
                  className="button-danger delete-button"
                  aria-label="Slett poll"
                  title="Slett denne poll"
                >
                  🗑️ Slett
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Export buttons - show if poll has votes */}
        {totalVotes > 0 && (
          <div className="poll-export-section">
            <h3>Eksporter resultater</h3>
            <div className="export-buttons">
              <button
                onClick={handleExportCSV}
                className="button-secondary"
                aria-label="Eksporter poll som CSV"
                title="Eksporter som CSV"
              >
                📊 Eksporter CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="button-secondary"
                aria-label="Eksporter poll som PDF"
                title="Eksporter som PDF (åpner print-dialog)"
              >
                📄 Eksporter PDF
              </button>
            </div>
          </div>
        )}

        {poll.description && (
          <p className="poll-description">{poll.description}</p>
        )}

        {poll.category && (
          <div className="poll-category-section">
            <span className="category-badge">
              {getCategoryLabel(poll.category)}
            </span>
          </div>
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
                  loading="lazy"
                  decoding="async"
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rapporter poll</h2>
            <form onSubmit={handleReportPoll}>
              <div className="form-group">
                <label htmlFor="report-reason">Grunn for rapportering *</label>
                <select
                  id="report-reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="">Velg en grunn</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Uegnet innhold</option>
                  <option value="offensive">Støtende innhold</option>
                  <option value="other">Annet</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="report-description">Beskrivelse (valgfritt)</label>
                <textarea
                  id="report-description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows="4"
                  placeholder="Beskriv problemet..."
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setReportDescription('');
                  }}
                  className="button-secondary"
                >
                  Avbryt
                </button>
                <button type="submit" className="button-danger">
                  Rapporter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollDetailPage;

