import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether a media query matches, kept live as it changes (rotating an iPad,
 * plugging in a mouse).
 *
 * False on the server and during hydration, so markup never commits to a
 * breakpoint the server couldn't know; the real value arrives straight after.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);

      list.addEventListener('change', onChange);

      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
