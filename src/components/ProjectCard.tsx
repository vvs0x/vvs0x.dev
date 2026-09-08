import type { Project } from '../types';
import Card from './Card';
import CardMeta from './CardMeta';
import styles from './Card.module.css';

export default function ProjectCard({ project }: { project: Project }) {
  const { id, title, category, date, image, color, body } = project;

  return (
    <Card to={body ? `/projects/${id}` : undefined}>
      <div className={styles.visual}>
        {image ? (
          <img
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
      <CardMeta category={category} title={title} date={date} status="Coming soon" />
    </Card>
  );
}
