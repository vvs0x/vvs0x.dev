import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './Layout.module.css';

/**
 * Navbar and main content fill at least the first viewport; the footer
 * starts below the fold and is revealed by scrolling.
 */
export default function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className={styles.shell}>
        <Navbar />
        <main id="main" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
