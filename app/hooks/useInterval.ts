import { useEffect, useRef } from 'react';

/**
 * setInterval that always calls the latest `callback` without restarting the
 * timer. Pass `reset` to deliberately restart it (e.g. on a theme change).
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  reset?: unknown
): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay, reset]);
}
