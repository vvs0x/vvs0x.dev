import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

/**
 * Start page: name and one line about me over a loss surface in 3D, where a
 * point runs gradient descent (lossSurface.ts). three.js is loaded here on
 * demand, as its own file, so the other pages don't load it.
 */
export default function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  // The legend only appears once the surface runs; without WebGL it stays hidden.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let dispose: (() => void) | null = null;
    let cancelled = false;
    import('./lossSurface').then(({ mountLossSurface }) => {
      if (cancelled || !stage.current || !marker.current) return;
      dispose = mountLossSurface(stage.current, { marker: marker.current });
      if (dispose) setReady(true);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <section className={styles.hero} data-ready={ready || undefined}>
      <div
        ref={stage}
        className={styles.stage}
        role="img"
        aria-label="Contour lines of a loss surface that look like wood grain. A point follows the gradient downhill until it settles in a minimum."
      />
      <div ref={marker} className={styles.marker} aria-hidden="true">
        <span />
      </div>

      <div className={styles.foot}>
        <div className={styles.intro}>
          <h1 className={styles.name}>Valentín Schwarz</h1>
          <p className={styles.lede}>Former carpenter, now studying Data Science.</p>
        </div>

        <p className={styles.legend} hidden={!ready}>
          Gradient descent on a random loss surface
        </p>
      </div>
    </section>
  );
}
