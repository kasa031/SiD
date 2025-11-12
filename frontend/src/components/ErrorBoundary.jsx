import React from 'react';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const errorMessage = error?.message || 'En uventet feil oppstod';
      const errorName = error?.name || 'Error';
      
      return (
        <div className="error-boundary">
          <h2>Noe gikk galt</h2>
          <p>Vi beklager, men en uventet feil oppstod.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Tekniske detaljer</summary>
              <div style={{ 
                background: '#2a2a2a', 
                padding: '1rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}>
                <strong>Feiltype:</strong> {errorName}<br />
                <strong>Melding:</strong> {errorMessage}
              </div>
            </details>
          )}
          <button onClick={() => window.location.reload()}>
            Last siden på nytt
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

