import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * jsdom implements neither IntersectionObserver nor matchMedia, and several
 * components observe elements or query motion preferences on mount.
 */
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];
  readonly options: IntersectionObserverInit;

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  constructor(
    private callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ) {
    this.options = options;
    this.rootMargin = options.rootMargin ?? '';
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0];

    MockIntersectionObserver.instances.push(this);
  }

  /** Drive the observer callback from a test. */
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this);
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

beforeEach(() => {
  MockIntersectionObserver.instances = [];
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
