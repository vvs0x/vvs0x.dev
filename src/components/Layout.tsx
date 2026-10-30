import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './Layout.module.css';

/**
 * Navbar and main content fill at least the first viewport. There is no site
 * footer; the copyright line sits at the end of the About page.
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
    </>
  );
}
