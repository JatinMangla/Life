import { Component } from 'react';
import type { ReactNode } from 'react';

interface DecorativeBoundaryProps {
  children: ReactNode;
  /** Lets the parent swap in a static alternative, e.g. a poster. */
  onError?: (error: unknown) => void;
}

interface DecorativeBoundaryState {
  failed: boolean;
}

/**
 * Renders nothing if a purely decorative island throws.
 *
 * The WebGL scenes (hero sphere, device models, contact globe) are
 * `aria-hidden` ornaments. Without a boundary, one failing to get a GPU
 * context — software rendering, a blocklisted driver, hardware acceleration
 * switched off, a remote desktop — bubbled to the root ErrorBoundary and
 * replaced the entire page with "Something went wrong".
 */
export class DecorativeBoundary extends Component<
  DecorativeBoundaryProps,
  DecorativeBoundaryState
> {
  state: DecorativeBoundaryState = { failed: false };

  static getDerivedStateFromError(): DecorativeBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[decorative] scene failed to render and was skipped:', error);
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
