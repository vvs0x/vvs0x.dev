import styles from './About.module.css';

export default function About() {
  return (
    <>
      <section className={styles.hero} data-snap>
        <h1 className={styles.headline}>
          I traded <span className="gradient-text">sawdust for code,</span>
          <br className={styles.wideOnly} /> but I still can’t stand{' '}
          <span className="gradient-text">sloppy work.</span>
        </h1>
        <p className={styles.lead}>
          Former carpenter, now a data science student. Different tools, same instinct: build
          things properly, or don’t build them at all.
        </p>
      </section>

      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.prose}>
          <h2 id="story-title" className={styles.storyTitle}>
            The Foundation
          </h2>
          <p>
            For years, my day-to-day revolved around measuring angles, crafting furniture, and
            obsessing over the fine details. Carpentry taught me a fundamental truth: a flaw in the
            foundation will eventually compromise the entire build, no matter how good the paint looks on the outside.
          </p>
          <p>
            Now, as a third-semester data science student, I’ve realized the rules haven't changed,
            only the materials. Instead of shaping wood, I architect data pipelines. The work still
            demands precision, reliable tooling, and a deep respect for the raw materials. My goal
            isn't just to write scripts that run; it's to engineer infrastructure that lasts.
          </p>
        </div>
      </section>
    </>
  );
}
