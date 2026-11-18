import { useRef, type CSSProperties } from 'react';
import type { Entry } from '../types';
import { useContainInset } from '../hooks/useContainInset';
import Card from './Card';
import CardMeta from './CardMeta';
import styles from './Card.module.css';

interface EntryCardProps {
  entry: Entry;
  /** Route the detail pages live under, e.g. "/projects". */
  basePath: string;
}

export default function EntryCard({ entry, basePath }: EntryCardProps) {
  const { id, title, category, date, image, color, body } = entry;

  // The picture is centred in its box; the text below lines up with the
  // picture's left edge, so the box's side gap is passed to the card as a
  // custom property.
  const imageRef = useRef<HTMLImageElement>(null);
  const inset = useContainInset(imageRef, image ? image.width / image.height : 1);
  const cardStyle = image ? ({ '--card-image-inset': `${inset}px` } as CSSProperties) : undefined;

  return (
    <Card to={body ? `${basePath}/${id}` : undefined} style={cardStyle}>
      <div className={styles.visual}>
        {image ? (
          <img
            ref={imageRef}
            className={styles.image}
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            decoding="async"
          />
        ) : (
          <div className={styles.swatch} style={{ backgroundColor: color }} aria-hidden="true" />
        )}
      </div>
      <CardMeta category={category} title={title} date={date} />
    </Card>
  );
}
