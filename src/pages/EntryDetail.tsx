import { useParams } from 'react-router-dom';
import type { Entry } from '../types';
import { projects } from '../data/projects';
import { playground } from '../data/playground';
import { formatDate } from '../utils/formatDate';
import NotFound from './NotFound';
import styles from './EntryDetail.module.css';

type Collection = 'projects' | 'playground';

const COLLECTIONS: Record<Collection, readonly Entry[]> = {
  projects,
  playground,
};

export default function EntryDetail({ collection }: { collection: Collection }) {
  const { id } = useParams<{ id: string }>();
  const entry = COLLECTIONS[collection].find((item) => item.id === id);

  // Placeholders have no body and therefore no page.
  if (!entry?.body) {
    return <NotFound />;
  }

  return (
    <article className={styles.article}>
      <title>{`${entry.title} – vvs0x.dev`}</title>

      <header className={styles.header}>
        <p className={styles.category}>{entry.category}</p>
        <h1 className={styles.title}>{entry.title}</h1>
        {entry.date && (
          <time dateTime={entry.date} className={styles.date}>
            {formatDate(entry.date)}
          </time>
        )}
      </header>

      {entry.image && (
        <figure className={styles.figure}>
          <img
            src={entry.image.src}
            alt={entry.image.alt}
            width={entry.image.width}
            height={entry.image.height}
          />
        </figure>
      )}

      <div className={styles.body}>
        {entry.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {entry.links && entry.links.length > 0 && (
        <ul className={styles.links}>
          {entry.links.map(({ label, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
