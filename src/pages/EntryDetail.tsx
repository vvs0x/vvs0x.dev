import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { Entry } from '../types';
import { projects } from '../data/projects';
import { playground } from '../data/playground';
import { formatDate, isIsoDate } from '../utils/formatDate';
import { slugify } from '../utils/slugify';
import { useActiveSection } from '../hooks/useActiveSection';
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

  const sections = useMemo(
    () => (entry?.body ?? []).map((section) => ({ ...section, id: slugify(section.heading) })),
    [entry],
  );
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const activeId = useActiveSection(sectionIds);

  // Placeholders have no body and therefore no page.
  if (!entry?.body) {
    return <NotFound />;
  }

  return (
    <article>
      <title>{`${entry.title} – vvs0x.dev`}</title>

      <header className={entry.image ? `${styles.header} ${styles.withImage}` : styles.header}>
        <div className={styles.intro}>
          <div>
            <p className={styles.category}>{entry.category}</p>
            <h1 className={styles.title}>{entry.title}</h1>
          </div>
          {entry.date &&
            (isIsoDate(entry.date) ? (
              <time dateTime={entry.date} className={styles.date}>
                {formatDate(entry.date)}
              </time>
            ) : (
              <p className={styles.date}>{entry.date}</p>
            ))}
        </div>

        {entry.image && (
          <figure className={styles.media}>
            <img
              src={entry.image.src}
              alt={entry.image.alt}
              width={entry.image.width}
              height={entry.image.height}
            />
          </figure>
        )}
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.toc} aria-label="On this page">
            <ul className={styles.tocList}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={
                      section.id === activeId ? `${styles.tocLink} ${styles.active}` : styles.tocLink
                    }
                    aria-current={section.id === activeId ? 'location' : undefined}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className={styles.content}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2 className={styles.heading}>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}

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
        </div>
      </div>
    </article>
  );
}
