import { useEffect, useState } from 'react';

/** Fraction of the viewport height below which a section counts as "reached". */
const READING_LINE = 0.4;

/**
 * Returns the id of the section the reader is currently in: the last section
 * whose top has passed the reading line, or the last section once the page is
 * scrolled to the bottom. `ids` should be memoised by the caller.
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(() => ids[0]);

  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const { innerHeight, scrollY } = window;
      const { scrollHeight } = document.documentElement;
      const scrollable = scrollHeight > innerHeight + 1;
      const atBottom = scrollable && scrollY + innerHeight >= scrollHeight - 1;

      let current = ids[0];
      if (atBottom) {
        current = ids[ids.length - 1];
      } else {
        const line = innerHeight * READING_LINE;
        for (const id of ids) {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= line) {
            current = id;
          }
        }
      }
      setActive(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return active;
}
