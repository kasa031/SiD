import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { validateUsername, validatePassword } from '../utils/validation';
import '../styles/Auth.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setValidationErrors({
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      window.showToast?.('Innlogging vellykket!', 'success');
      navigate('/');
      window.location.reload();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Innlogging feilet';
      setError(errorMsg);
      window.showToast?.(errorMsg, 'error');
    }
  };

  return (
    <div className="auth-container" role="main">
      <div className="auth-card">
        <h1>Logg inn</h1>
        {error && (
          <div className="error-message" role="alert" aria-live="polite">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} aria-label="Innloggingsskjema">
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
              aria-required="true"
              aria-invalid={validationErrors.password ? 'true' : 'false'}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
              autoComplete="current-password"
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
            className="button-blue full-width"
            aria-label="Logg inn på konto"
          >
            Logg inn
          </button>
        </form>
        <p className="auth-link">
          Har du ikke konto? <Link to="/register" aria-label="Gå til registreringsside">Registrer deg her</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

