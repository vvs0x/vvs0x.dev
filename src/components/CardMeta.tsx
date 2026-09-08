import { formatDate } from '../utils/formatDate';
import styles from './Card.module.css';

interface CardMetaProps {
  category: string;
  title: string;
  /** ISO date; shown when present. */
  date?: string;
  /** Shown instead of the date when there is none, e.g. "Coming soon". */
  status?: string;
}

export default function CardMeta({ category, title, date, status }: CardMetaProps) {
  return (
    <div className={styles.meta}>
      <p className={styles.category}>{category}</p>
      <h2 className={styles.title}>{title}</h2>
      {date ? (
        <time dateTime={date} className={styles.detail}>
          {formatDate(date)}
        </time>
      ) : (
        status && <p className={styles.detail}>{status}</p>
      )}
    </div>
  );
}
