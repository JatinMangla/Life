import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * Report a scroll-derived offset, clamped to one viewport height and batched
 * into a single rAF per frame. Does nothing when reduced motion is preferred
 * or the multiplier is 0.
 */
export function useParallax(multiplier: number, onChange: (offset: number) => void): void {
  const reduceMotion = useReducedMotion();
  // Every caller passes an inline arrow. With `onChange` in the effect's
  // dependencies, each re-render of the caller tore down the scroll listener
  // and forced a fresh measurement.
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (reduceMotion || multiplier === 0) return;

    let ticking = false;
    let animationFrame = 0;

    const animate = () => {
      const { innerHeight } = window;
      const offset = Math.max(0, window.scrollY) * multiplier;

      onChangeRef.current(Math.max(-innerHeight, Math.min(innerHeight, offset)));
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [multiplier, reduceMotion]);
}
