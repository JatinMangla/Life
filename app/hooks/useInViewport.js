import { useEffect, useState } from 'react';

export function useInViewport(
  elementRef,
  unobserveOnIntersect,
  options = {},
  shouldObserve = true
) {
  const [intersect, setIntersect] = useState(false);
  const [isUnobserved, setIsUnobserved] = useState(false);

  // Destructured to primitives on purpose. `options` is an object literal at
  // almost every call site, so a fresh identity each render would put it in
  // the dependency array below and tear down + rebuild the observer on every
  // single render of every consumer.
  const { root = null, rootMargin, threshold } = options;

  useEffect(() => {
    if (!elementRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isIntersecting, target } = entry;

        setIntersect(isIntersecting);

        if (isIntersecting && unobserveOnIntersect) {
          observer.unobserve(target);
          setIsUnobserved(true);
        }
      },
      { root, rootMargin, threshold }
    );

    if (!isUnobserved && shouldObserve) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [
    elementRef,
    unobserveOnIntersect,
    root,
    rootMargin,
    threshold,
    isUnobserved,
    shouldObserve,
  ]);

  return intersect;
}
