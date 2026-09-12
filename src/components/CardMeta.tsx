import { formatDate, isIsoDate } from '../utils/formatDate';
import styles from './Card.module.css';

interface CardMetaProps {
  category: string;
  title: string;
  /** ISO date or a label such as "TBA"; shown when present. */
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
        isIsoDate(date) ? (
          <time dateTime={date} className={styles.detail}>
            {formatDate(date)}
          </time>
        ) : (
          <p className={styles.detail}>{date}</p>
        )
      ) : (
        status && <p className={styles.detail}>{status}</p>
      )}
    </div>
  );
}
