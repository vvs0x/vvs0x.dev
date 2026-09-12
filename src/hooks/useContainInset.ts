import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * For an image with `object-fit: contain`, returns the horizontal gap in px
 * between the image box and the painted picture on each side. Lets text be
 * aligned with the picture's edge instead of the box's edge.
 */
export function useContainInset(ref: RefObject<HTMLElement | null>, aspectRatio: number): number {
  const [inset, setInset] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      const paintedWidth = Math.min(width, height * aspectRatio);
      setInset(Math.max(0, Math.round((width - paintedWidth) / 2)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, aspectRatio]);

  return inset;
}
