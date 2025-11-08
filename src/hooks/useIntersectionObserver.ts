import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

interface IntersectionObserverReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

/**
 * Custom hook for Intersection Observer API
 * Used for lazy loading, infinite scroll, and animations
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}): IntersectionObserverReturn<T> {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref: elementRef, isIntersecting, entry };
}