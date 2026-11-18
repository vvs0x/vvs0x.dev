import { Link } from 'react-router-dom';
import { pageTitle } from '../utils/pageTitle';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <section className={styles.section}>
      <title>{pageTitle('Page not found')}</title>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>This page got lost in the data pipeline.</p>
      <Link to="/" className={styles.back}>
        Back home
      </Link>
    </section>
  );
}
