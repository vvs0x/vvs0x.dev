import type { PlaygroundItem } from '../types';
import Card from './Card';
import CardMeta from './CardMeta';
import cardStyles from './Card.module.css';
import styles from './PlaygroundCard.module.css';

export default function PlaygroundCard({ item }: { item: PlaygroundItem }) {
  const { id, title, category, date, type, color, excerpt, colSpan, body } = item;
  const isThought = type === 'thought';

  // Thought cards show their title large at the top, so the meta title is the
  // call to action ("Read entry") or the status ("Coming soon") instead.
  const metaTitle = isThought ? (body ? 'Read entry' : 'Coming soon') : title;

  return (
    <Card to={body ? `/playground/${id}` : undefined} colSpan={colSpan}>
      <div className={isThought ? `${cardStyles.visual} ${styles.thought}` : cardStyles.visual}>
        {isThought ? (
          <>
            <p className={styles.headline}>{title}</p>
            {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
          </>
        ) : (
          <div className={cardStyles.swatch} style={{ backgroundColor: color }} aria-hidden="true" />
        )}
      </div>
      <CardMeta
        category={category}
        title={metaTitle}
        date={date}
        status={isThought ? undefined : 'Coming soon'}
      />
    </Card>
  );
}
