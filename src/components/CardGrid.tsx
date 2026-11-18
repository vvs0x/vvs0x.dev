import type { ReactNode } from 'react';
import styles from './CardGrid.module.css';

/**
 * Card grid of Projects and Playground: in every group of three cards, one
 * spans two columns and two rows, alternating between the left and the
 * right side.
 */
export default function CardGrid({ children }: { children: ReactNode }) {
  return (
    <section className={styles.section}>
      <ul className={styles.grid}>{children}</ul>
    </section>
  );
}
