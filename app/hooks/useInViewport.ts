import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

export function useInViewport(
  elementRef: RefObject<Element | null> | undefined,
  unobserveOnIntersect = false,
  options: IntersectionObserverInit = {},
  shouldObserve = true
): boolean {
  const [intersect, setIntersect] = useState(false);
  const [isUnobserved, setIsUnobserved] = useState(false);

  // Destructured to primitives on purpose. `options` is an object literal at
  // almost every call site, so a fresh identity each render would put it in
  // the dependency array below and tear down + rebuild the observer on every
  // single render of every consumer.
  const { root = null, rootMargin, threshold } = options;

  useEffect(() => {
    const element = elementRef?.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setIntersect(entry.isIntersecting);

        if (entry.isIntersecting && unobserveOnIntersect) {
          observer.unobserve(entry.target);
          setIsUnobserved(true);
        }
      },
      { root, rootMargin, threshold }
    );

    if (!isUnobserved && shouldObserve) {
      observer.observe(element);
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
