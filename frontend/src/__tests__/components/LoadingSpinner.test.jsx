import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

describe('LoadingSpinner', () => {
  it('skal rendre spinner med standard melding', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Laster...')).toBeInTheDocument();
  });

  it('skal rendre spinner med tilpasset melding', () => {
    render(<LoadingSpinner message="Venter på svar..." />);
    expect(screen.getByText('Venter på svar...')).toBeInTheDocument();
  });

  it('skal ha loading-spinner-container klasse', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.loading-spinner-container')).toBeInTheDocument();
  });

  it('skal ha loading-spinner klasse', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });
});

