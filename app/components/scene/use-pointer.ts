import { useEffect, useRef } from 'react';
import { touchPrimaryQuery } from '~/utils/style';

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
 *
 * Touch screens have no cursor, so on phones and iPads every scene sat
 * frozen at its resting angle. There, scrolling stands in for the cursor:
 * the objects turn as the page moves under the finger. Touches themselves
 * are ignored — a drag is a scroll, and the position would jump to wherever
 * the finger lands.
 */
export function usePointer() {
  const pointer = useRef<PointerPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const handleScroll = () => {
      const progress = window.scrollY / window.innerHeight;

      pointer.current.x = Math.sin(progress * 1.6) * 0.7;
      pointer.current.y = Math.cos(progress * 1.1) * 0.35 - 0.1;
    };

    const isTouch = window.matchMedia(touchPrimaryQuery).matches;

    window.addEventListener('pointermove', handleMove, { passive: true });

    if (isTouch) {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return pointer;
}
