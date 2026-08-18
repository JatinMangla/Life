import { useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Report a scroll-derived offset, clamped to one viewport height and batched
 * into a single rAF per frame. Does nothing when reduced motion is preferred.
 */
export function useParallax(multiplier: number, onChange: (offset: number) => void): void {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let ticking = false;
    let animationFrame = 0;

    const animate = () => {
      const { innerHeight } = window;
      const offset = Math.max(0, window.scrollY) * multiplier;

      onChange(Math.max(-innerHeight, Math.min(innerHeight, offset)));
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [multiplier, onChange, reduceMotion]);
}
