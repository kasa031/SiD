import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import BadgeDisplay from '../components/BadgeDisplay';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchCurrentUser();
  }, [id]);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response.data.user);
    } catch (error) {
      // Not logged in
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Feil ved henting av profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    try {
      await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchUser();
      fetchCurrentUser();
      setFile(null);
      alert('Profilbilde opplastet!');
    } catch (error) {
      alert(error.response?.data?.error || 'Feil ved opplasting');
    } finally {
      setUploading(false);
    }
  };

  const isOwnProfile = currentUser && user && currentUser.id === user.id;

  if (loading) {
    return <div className="loading">Laster profil...</div>;
  }

  if (!user) {
    return <div className="error">Bruker ikke funnet</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture-container">
            <img
              src={getAvatarUrl(user.profile_picture_url)}
              alt={user.username}
              className="profile-picture"
              onError={(e) => {
                e.target.src = getAvatarUrl();
              }}
            />
            {isOwnProfile && (
              <div className="profile-picture-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="profile-picture-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="profile-picture-input" className="upload-button">
                  Endre bilde
                </label>
                {file && (
                  <div className="upload-actions">
                    <button onClick={handleUpload} disabled={uploading} className="button-green">
                      {uploading ? 'Laster opp...' : 'Last opp'}
                    </button>
                    <button onClick={() => setFile(null)} className="button-red">
                      Avbryt
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p className="profile-meta">
              Medlem siden {new Date(user.created_at).toLocaleDateString('no-NO')}
            </p>
            {user.email && <p className="profile-email">{user.email}</p>}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{user.polls_count || 0}</span>
            <span className="stat-label">Polls opprettet</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.votes_count || 0}</span>
            <span className="stat-label">Stemmer gitt</span>
          </div>
        </div>

        <BadgeDisplay userId={user.id} />
      </div>
    </div>
  );
}

export default ProfilePage;

