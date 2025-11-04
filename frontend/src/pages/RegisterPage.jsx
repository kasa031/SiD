import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { validateUsername, validatePassword, validateEmail } from '../utils/validation';
import '../styles/Auth.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const emailError = validateEmail(email);

    if (usernameError || passwordError || emailError) {
      setValidationErrors({
        username: usernameError,
        password: passwordError,
        email: emailError,
      });
      return;
    }

    try {
      const response = await api.post('/auth/register', { username, password, email });
      localStorage.setItem('token', response.data.token);
      window.showToast?.('Registrering vellykket!', 'success');
      navigate('/');
      window.location.reload();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registrering feilet';
      setError(errorMsg);
      window.showToast?.(errorMsg, 'error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registrer deg</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Brukernavn</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (validationErrors.username) {
                  setValidationErrors({ ...validationErrors, username: null });
                }
              }}
              required
            />
            {validationErrors.username && (
              <span className="validation-error">{validationErrors.username}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">E-post (valgfritt)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: null });
                }
              }}
            />
            {validationErrors.email && (
              <span className="validation-error">{validationErrors.email}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Passord</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: null });
                }
              }}
              required
              minLength={6}
            />
            {validationErrors.password && (
              <span className="validation-error">{validationErrors.password}</span>
            )}
          </div>
          <button type="submit" className="button-green full-width">
            Registrer
          </button>
        </form>
        <p className="auth-link">
          Har du allerede konto? <Link to="/login">Logg inn her</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

