import { useCallback, useEffect, useState } from 'react';

// Zero on the server and on the very first client render, so consumers can
// distinguish "not measured yet" from a real viewport width. Guarding on
// `width > 0` is what keeps SSR markup from committing to a breakpoint it
// can't know, rather than silently rendering the desktop layout.
const INITIAL_SIZE = { width: 0, height: 0 };

// iOS Safari reports an innerHeight that includes the collapsing URL bar. A
// fixed 100vh element measures what the page can actually use.
function measureViewportHeight() {
  const ruler = document.createElement('div');

  ruler.style.position = 'fixed';
  ruler.style.top = '0';
  ruler.style.width = '0';
  ruler.style.height = '100vh';

  document.documentElement.appendChild(ruler);
  const height = ruler.offsetHeight;
  document.documentElement.removeChild(ruler);

  return height;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(INITIAL_SIZE);

  const getSize = useCallback(() => {
    const isIOS = /iphone|ipod|ipad/i.test(navigator.userAgent);

    return {
      width: window.innerWidth,
      height: isIOS ? measureViewportHeight() : window.innerHeight,
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize(getSize());

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [getSize]);

  return windowSize;
}
