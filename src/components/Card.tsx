import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Card.module.css';

interface CardProps {
  /** Link target. Without it the card renders as a non-interactive placeholder. */
  to?: string;
  /** Desktop column span, read by the grid. */
  colSpan?: number;
  /** Inline custom properties for the card, e.g. --card-image-inset. */
  style?: CSSProperties;
  children: ReactNode;
}

export default function Card({ to, colSpan, style, children }: CardProps) {
  return (
    <li className={styles.card} data-span={colSpan} style={style}>
      {to ? (
        <Link to={to} className={`${styles.inner} ${styles.interactive}`}>
          {children}
        </Link>
      ) : (
        <div className={styles.inner}>{children}</div>
      )}
    </li>
  );
}
