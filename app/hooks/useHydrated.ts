import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Whether React has hydrated. Unlike useHasMounted this doesn't cause a second
 * render pass on the client, so it's the right gate for client-only content.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
