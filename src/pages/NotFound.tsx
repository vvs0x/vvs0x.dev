import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <section className={styles.section}>
      <title>Page not found – vvs0x.dev</title>
      <h1 className={styles.code}>
        <span className="gradient-text">404</span>
      </h1>
      <p className={styles.message}>This page got lost in the data pipeline.</p>
      <Link to="/" className={styles.back}>
        Back home
      </Link>
    </section>
  );
}
