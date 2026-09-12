import styles from './ComingSoon.module.css';

/** Temporary cover for a section that is not ready yet. */
export default function ComingSoon({ title }: { title: string }) {
  return (
    <section className={styles.section}>
      <title>{`${title} – vvs0x.dev`}</title>
      <h1 className={styles.title}> Coming Soon... </h1>
    </section>
  );
}
