import { useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from '@remix-run/react';
import { useCallback, useRef } from 'react';

export type ScrollToHash = (hash: string, onDone?: () => void) => (() => void) | undefined;

/**
 * Smooth-scroll to an in-page anchor, then update the URL once scrolling has
 * settled — so the hash doesn't fight the animation.
 */
export function useScrollToHash(): ScrollToHash {
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return useCallback(
    (hash, onDone) => {
      const id = hash.split('#')[1];

      if (!id) return;

      const targetElement = document.getElementById(id);

      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

      const handleScroll = () => {
        clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll);

          if (window.location.pathname === location.pathname) {
            onDone?.();
            navigate(`${location.pathname}#${id}`, { preventScrollReset: true });
          }
        }, 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout.current);
      };
    },
    [navigate, reduceMotion, location.pathname]
  );
}
