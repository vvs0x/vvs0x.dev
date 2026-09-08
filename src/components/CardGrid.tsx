import type { ReactNode } from 'react';
import styles from './CardGrid.module.css';

interface CardGridProps {
  children: ReactNode;
  /**
   * "featured": in every group of three cards, one spans two columns and
   * two rows, alternating between the left and the right side.
   */
  pattern?: 'featured';
  /** Snap scrolling between the grid (page top) and the footer, desktop only. */
  snap?: boolean;
}

export default function CardGrid({ children, pattern, snap = false }: CardGridProps) {
  const className = pattern === 'featured' ? `${styles.grid} ${styles.featured}` : styles.grid;

  return (
    <section className={styles.section} data-snap={snap ? 'desktop' : undefined}>
      <ul className={className}>{children}</ul>
    </section>
  );
}
