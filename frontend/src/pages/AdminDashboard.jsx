import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchReports();
      fetchStats();
    }
  }, [isAdmin, filterStatus]);

  const checkAdminStatus = async () => {
    try {
      const response = await api.get('/admin/check');
      setIsAdmin(response.data.is_admin);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        window.showToast?.('Du har ikke tilgang til admin-dashboard', 'error');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await api.get('/admin/reports', { params });
      setReports(response.data.reports);
    } catch (error) {
      console.error('Feil ved henting av rapporter:', error);
      window.showToast?.('Feil ved henting av rapporter', 'error');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Feil ved henting av statistikk:', error);
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      await api.put(`/admin/reports/${reportId}`, { status: newStatus });
      window.showToast?.('Rapport status oppdatert', 'success');
      fetchReports();
      fetchStats();
    } catch (error) {
      window.showToast?.(error.response?.data?.error || 'Feil ved oppdatering', 'error');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Er du sikker på at du vil slette denne poll permanent? Denne handlingen kan ikke angres.')) {
      return;
    }

    try {
      await api.delete(`/admin/polls/${pollId}`);
      window.showToast?.('Poll slettet permanent', 'success');
      fetchReports();
      fetchStats();
    } catch (error) {
      window.showToast?.(error.response?.data?.error || 'Feil ved sletting', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Venter';
      case 'reviewed':
        return 'Gjennomgått';
      case 'resolved':
        return 'Løst';
      default:
        return status;
    }
  };

  const getReasonLabel = (reason) => {
    switch (reason) {
      case 'spam':
        return 'Spam';
      case 'inappropriate':
        return 'Uegnet innhold';
      case 'offensive':
        return 'Støtende innhold';
      case 'other':
        return 'Annet';
      default:
        return reason;
    }
  };

  if (loading) {
    return <div className="loading">Laster...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="error-container">
        <h2>Ingen tilgang</h2>
        <p>Du har ikke tilgang til admin-dashboard.</p>
        <Link to="/" className="button-blue">Tilbake til hjemmeside</Link>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Statistikk */}
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Brukere</h3>
            <p className="stat-number">{stats.total_users}</p>
          </div>
          <div className="stat-card">
            <h3>Polls</h3>
            <p className="stat-number">{stats.total_polls}</p>
          </div>
          <div className="stat-card">
            <h3>Stemmer</h3>
            <p className="stat-number">{stats.total_votes}</p>
          </div>
          <div className="stat-card">
            <h3>Kommentarer</h3>
            <p className="stat-number">{stats.total_comments}</p>
          </div>
          <div className="stat-card highlight">
            <h3>Ventende rapporter</h3>
            <p className="stat-number">{stats.pending_reports}</p>
          </div>
          <div className="stat-card">
            <h3>Totale rapporter</h3>
            <p className="stat-number">{stats.total_reports}</p>
          </div>
        </div>
      )}

      {/* Filtrering */}
      <div className="admin-filters">
        <label htmlFor="status-filter">Filtrer etter status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Alle</option>
          <option value="pending">Venter</option>
          <option value="reviewed">Gjennomgått</option>
          <option value="resolved">Løst</option>
        </select>
      </div>

      {/* Rapporter */}
      <div className="admin-reports">
        <h2>Rapporterte Polls ({reports.length})</h2>
        {reports.length === 0 ? (
          <p className="no-reports">Ingen rapporter funnet</p>
        ) : (
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div>
                    <h3>
                      <Link to={`/poll/${report.poll_id}`}>{report.poll_title}</Link>
                    </h3>
                    <p className="report-meta">
                      Rapportert av: {report.reporter_username || 'Anonym'} •{' '}
                      {new Date(report.created_at).toLocaleString('no-NO')}
                    </p>
                    <p className="report-meta">
                      Opprettet av: {report.poll_creator_username} • Antall rapporter: {report.report_count}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>
                <div className="report-details">
                  <p><strong>Grunn:</strong> {getReasonLabel(report.reason)}</p>
                  {report.description && (
                    <p><strong>Beskrivelse:</strong> {report.description}</p>
                  )}
                </div>
                <div className="report-actions">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateReportStatus(report.id, 'reviewed')}
                        className="button-blue"
                      >
                        Marker som gjennomgått
                      </button>
                      <button
                        onClick={() => handleUpdateReportStatus(report.id, 'resolved')}
                        className="button-green"
                      >
                        Marker som løst
                      </button>
                    </>
                  )}
                  {report.status === 'reviewed' && (
                    <button
                      onClick={() => handleUpdateReportStatus(report.id, 'resolved')}
                      className="button-green"
                    >
                      Marker som løst
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePoll(report.poll_id)}
                    className="button-danger"
                  >
                    Slett poll permanent
                  </button>
                  <Link to={`/poll/${report.poll_id}`} className="button-secondary">
                    Se poll
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

