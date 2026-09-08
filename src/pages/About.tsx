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
            For years, my day-to-day involved measuring angles, cutting timber, and ensuring every
            load-bearing structure was mathematically sound. Woodworking taught me that a flaw in
            the foundation eventually compromises the entire build—no matter how nice the paint
            looks on the outside.
          </p>
          <p>
            When I transitioned into quantitative finance and data science, I realized the rules
            hadn’t changed—only the materials. Instead of framing walls, I now architect data
            pipelines and predictive models. It still requires precision, reliable tooling, and a
            deep respect for the raw materials. I don’t just want scripts that run; I want
            infrastructure that lasts.
          </p>
        </div>
      </section>
    </>
  );
}
