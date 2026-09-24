import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DecorativeBoundary } from './decorative-boundary';

function FailsInEffect() {
  useEffect(() => {
    // What `new WebGLRenderer({ failIfMajorPerformanceCaveat: true })` does
    // on a machine without a usable GPU.
    throw new Error('Error creating WebGL context.');
  }, []);

  return <canvas data-testid="canvas" />;
}

describe('DecorativeBoundary', () => {
  it('drops a scene that throws, and leaves the rest of the page alone', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <main>
        <h1>Jatin Mangla</h1>
        <DecorativeBoundary>
          <FailsInEffect />
        </DecorativeBoundary>
      </main>
    );

    expect(screen.getByRole('heading', { name: 'Jatin Mangla' })).toBeInTheDocument();
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
  });

  it('renders its children when nothing fails', () => {
    render(
      <DecorativeBoundary>
        <canvas data-testid="canvas" />
      </DecorativeBoundary>
    );

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });
});
