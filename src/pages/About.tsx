import { pageTitle } from '../utils/pageTitle';
import styles from './About.module.css';

/**
 * Photo for the right half. It is cropped to fill the half, so keep the
 * subject near the middle. Set to null to show a placeholder instead.
 */
const PHOTO: { src: string; alt: string } | null = {
  src: '/images/about_valentin.webp',
  alt: 'Valentín, seen from behind, leaning on the railing of a sunny open-air corridor and looking out at the trees.',
};

/**
 * One screen, split in half: a short text on the left, a photo on the right.
 * Like the cards, the label sits at the top edge and the text on the bottom one.
 */
export default function About() {
  return (
    <>
      <title>{pageTitle('About')}</title>
      <section className={styles.split}>
        <div className={styles.text}>
          <h1 className={styles.label}>About</h1>
          <div className={styles.copy}>
            <p>
              I’m Valentín, a Data Science student at the Zurich University of Applied Sciences in Winterthur,
              now in my third semester.
            </p>
            <p>
              Computers fascinated me from an early age, and my first plan was to
              train as a software developer. My grades weren’t good enough for that, so I became a carpenter instead.
              I spent five years in the trade, first as an apprentice and then working full time.
              The work was physically hard, and it taught me what it means to show up every day and finish a job properly.
              I’m grateful for that time and still rely on what I learned there.
            </p>
            <p>
              After my vocational baccalaureate
              I went back to my first interest, this time through data science. In a workshop, a cut that’s two millimetres
              off means the piece won’t fit, and everyone can see it. Data has the same problem, except a bad join or a
              missing value won’t show itself, so you have to go looking for it.
            </p>
          </div>
        </div>

        <figure className={styles.photo}>
          {PHOTO ? (
            <img src={PHOTO.src} alt={PHOTO.alt} />
          ) : (
            <span className={styles.placeholder}>Photo</span>
          )}
        </figure>
      </section>
    </>
  );
}
