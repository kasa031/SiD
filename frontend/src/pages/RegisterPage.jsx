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
    <div className="auth-container" role="main">
      <div className="auth-card">
        <h1>Registrer deg</h1>
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} aria-label="Registreringsskjema">
          <div className="form-group">
            <label htmlFor="username">Brukernavn</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (validationErrors.username) {
                  setValidationErrors({ ...validationErrors, username: null });
                }
              }}
              required
              aria-required="true"
              aria-invalid={validationErrors.username ? 'true' : 'false'}
              aria-describedby={validationErrors.username ? 'username-error' : undefined}
              autoComplete="username"
            />
            {validationErrors.username && (
              <span 
                id="username-error" 
                className="validation-error" 
                role="alert"
                aria-live="polite"
              >
                {validationErrors.username}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">E-post (valgfritt)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: null });
                }
              }}
              aria-invalid={validationErrors.email ? 'true' : 'false'}
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {validationErrors.email && (
              <span 
                id="email-error" 
                className="validation-error" 
                role="alert"
                aria-live="polite"
              >
                {validationErrors.email}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Passord</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: null });
                }
              }}
              required
              minLength={6}
              aria-required="true"
              aria-invalid={validationErrors.password ? 'true' : 'false'}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
              autoComplete="new-password"
            />
            {validationErrors.password && (
              <span 
                id="password-error" 
                className="validation-error" 
                role="alert"
                aria-live="polite"
              >
                {validationErrors.password}
              </span>
            )}
          </div>
          <button 
            type="submit" 
            className="button-green full-width"
            aria-label="Registrer ny konto"
          >
            Registrer
          </button>
        </form>
        <p className="auth-link">
          Har du allerede konto? <Link to="/login" aria-label="Gå til innloggingsside">Logg inn her</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

