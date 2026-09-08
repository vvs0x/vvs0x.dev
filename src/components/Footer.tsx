import { site } from '../data/site';
import styles from './Footer.module.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {YEAR} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
