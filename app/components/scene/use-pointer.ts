import { useEffect, useRef } from 'react';

export interface PointerPosition {
  /** -1 (left edge of the window) to 1 (right edge). */
  x: number;
  /** -1 (bottom) to 1 (top), matching three.js's y-up convention. */
  y: number;
}

/**
 * The pointer's position across the whole window, as a ref so reading it in
 * a frame loop never re-renders anything.
 *
 * R3F's own `state.pointer` only updates while the cursor is over the canvas.
 * The scenes tilt toward the cursor wherever it is on the page, which is what
 * makes them feel attached to it rather than to a rectangle.
 */
export function usePointer() {
  const pointer = useRef<PointerPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return pointer;
}
