import { useEffect, useRef, useState } from 'react';

export default function useInViewStagger(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.14,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return { ref, inView };
}
