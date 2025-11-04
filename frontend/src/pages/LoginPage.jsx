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
    <div className="auth-container">
      <div className="auth-card">
        <h1>Logg inn</h1>
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
            />
            {validationErrors.password && (
              <span className="validation-error">{validationErrors.password}</span>
            )}
          </div>
          <button type="submit" className="button-blue full-width">
            Logg inn
          </button>
        </form>
        <p className="auth-link">
          Har du ikke konto? <Link to="/register">Registrer deg her</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

