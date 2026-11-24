import { describe, expect, it, vi } from 'vitest';
import type { WebGLRenderer } from 'three';
import { cleanRenderer, isContextLost, watchContextLoss } from './three';

function fakeRenderer(canvas: HTMLCanvasElement) {
  return {
    domElement: canvas,
    dispose: vi.fn(),
    forceContextLoss: vi.fn(),
  };
}

describe('cleanRenderer', () => {
  it('releases the WebGL context once the canvas has left the page', () => {
    const renderer = fakeRenderer(document.createElement('canvas'));

    cleanRenderer(renderer as unknown as WebGLRenderer);

    expect(renderer.dispose).toHaveBeenCalled();
    expect(renderer.forceContextLoss).toHaveBeenCalled();
  });

  it('keeps the context while the canvas is still mounted', () => {
    // StrictMode's development double-invoke cleans up and re-runs effects on
    // the same canvas. Losing its context there left every scene dead.
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    const renderer = fakeRenderer(canvas);

    cleanRenderer(renderer as unknown as WebGLRenderer);

    expect(renderer.dispose).toHaveBeenCalled();
    expect(renderer.forceContextLoss).not.toHaveBeenCalled();
    canvas.remove();
  });

  it('tolerates a renderer that was never created', () => {
    expect(() => cleanRenderer(null)).not.toThrow();
  });
});

function watchedRenderer(canvas: HTMLCanvasElement, lost = false) {
  return {
    domElement: canvas,
    debug: { checkShaderErrors: true },
    getContext: () => ({ isContextLost: () => lost }),
  };
}

describe('watchContextLoss', () => {
  it('reports the browser taking the context back from a canvas on the page', () => {
    // iPad Safari reclaims contexts under memory pressure; the scene has to
    // swap to its fallback rather than draw on a dead context.
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    const onLost = vi.fn();

    watchContextLoss(watchedRenderer(canvas) as unknown as WebGLRenderer, onLost);
    canvas.dispatchEvent(new Event('webglcontextlost'));

    expect(onLost).toHaveBeenCalledTimes(1);
    canvas.remove();
  });

  it('ignores our own release of a canvas that has left the page', () => {
    const onLost = vi.fn();
    const canvas = document.createElement('canvas');

    watchContextLoss(watchedRenderer(canvas) as unknown as WebGLRenderer, onLost);
    canvas.dispatchEvent(new Event('webglcontextlost'));

    expect(onLost).not.toHaveBeenCalled();
  });

  it('stops listening when asked', () => {
    const canvas = document.createElement('canvas');
    document.body.append(canvas);
    const onLost = vi.fn();

    const stop = watchContextLoss(watchedRenderer(canvas) as unknown as WebGLRenderer, onLost);
    stop();
    canvas.dispatchEvent(new Event('webglcontextlost'));

    expect(onLost).not.toHaveBeenCalled();
    canvas.remove();
  });

  it('switches off the shader-log check that crashed on a lost context, outside development', () => {
    // three.js read gl.getProgramInfoLog(program).trim(); on a lost context
    // that log is null, and the TypeError took down the whole page.
    const renderer = watchedRenderer(document.createElement('canvas'));

    watchContextLoss(renderer as unknown as WebGLRenderer, () => {});

    expect(renderer.debug.checkShaderErrors).toBe(import.meta.env.DEV);
  });
});

describe('isContextLost', () => {
  it('reads the context directly, before three.js has seen the event', () => {
    const canvas = document.createElement('canvas');

    expect(isContextLost(watchedRenderer(canvas, true) as unknown as WebGLRenderer)).toBe(true);
    expect(isContextLost(watchedRenderer(canvas, false) as unknown as WebGLRenderer)).toBe(false);
  });

  it('treats a renderer that was never created as lost', () => {
    expect(isContextLost(null)).toBe(true);
  });
});
