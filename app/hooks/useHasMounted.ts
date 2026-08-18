import { useEffect, useState } from 'react';

/** False on the server and the first client render, true afterwards. */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
