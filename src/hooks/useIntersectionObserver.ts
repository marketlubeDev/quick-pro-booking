import { useEffect, useRef, useCallback } from "react";

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver({
  onIntersect,
  threshold = 0.1,
  rootMargin = "100px",
  enabled = true,
}: UseIntersectionObserverProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled) {
        onIntersect();
      }
    },
    [onIntersect, enabled]
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  return targetRef;
}
