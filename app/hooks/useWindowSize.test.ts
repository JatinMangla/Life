import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useWindowSize } from './useWindowSize';

/**
 * Regression tests. The original implementation used
 * `useRef(() => ({ w: 1280, h: 800 }))` — useRef has no lazy-initializer
 * form, so the state ended up keyed `w`/`h` while all six consumers read
 * `width`/`height`. Both were permanently `undefined`, which made every
 * `width <= breakpoint` check silently resolve to the desktop branch.
 */
describe('useWindowSize', () => {
  it('reports the real viewport after mount', () => {
    window.innerWidth = 1024;
    window.innerHeight = 768;

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('exposes width and height, not w and h', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(Object.keys(result.current).sort()).toEqual(['height', 'width']);
  });

  it('never reports undefined, so breakpoint checks are meaningful', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBeTypeOf('number');
    expect(result.current.height).toBeTypeOf('number');
  });

  it('updates on resize', () => {
    window.innerWidth = 1200;
    window.innerHeight = 800;

    const { result } = renderHook(() => useWindowSize());

    act(() => {
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(375);
    expect(result.current.height).toBe(667);
  });
});
