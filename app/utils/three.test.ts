import { describe, expect, it, vi } from 'vitest';
import type { WebGLRenderer } from 'three';
import { cleanRenderer } from './three';

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
