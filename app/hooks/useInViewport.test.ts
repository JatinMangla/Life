import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { useInViewport } from './useInViewport';
import { MockIntersectionObserver } from '../../test/setup';

function refTo(element: HTMLElement) {
  const ref = createRef<HTMLDivElement>();
  Object.assign(ref, { current: element });
  return ref;
}

/**
 * Regression test. `options = {}` used to sit in the effect's dependency
 * array. That default is a fresh object identity on every render, and every
 * call site passes an object literal, so each render tore the observer down
 * and built a new one.
 */
describe('useInViewport', () => {
  it('creates a single observer across re-renders with literal options', () => {
    const ref = refTo(document.createElement('div'));

    const { rerender } = renderHook(() => useInViewport(ref, false, { threshold: 0.2 }));

    expect(MockIntersectionObserver.instances).toHaveLength(1);

    rerender();
    rerender();
    rerender();

    expect(MockIntersectionObserver.instances).toHaveLength(1);
  });

  it('passes the observer options through', () => {
    const ref = refTo(document.createElement('div'));

    renderHook(() => useInViewport(ref, false, { threshold: 0.5, rootMargin: '10px' }));

    const [observer] = MockIntersectionObserver.instances;

    expect(observer?.options).toMatchObject({ threshold: 0.5, rootMargin: '10px' });
  });

  it('observes the element it was given', () => {
    const element = document.createElement('div');

    renderHook(() => useInViewport(refTo(element)));

    expect(MockIntersectionObserver.instances[0]?.observe).toHaveBeenCalledWith(element);
  });

  it('returns false when there is no element to observe', () => {
    const { result } = renderHook(() => useInViewport(createRef<HTMLDivElement>()));

    expect(result.current).toBe(false);
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });
});
