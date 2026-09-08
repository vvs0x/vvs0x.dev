import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { FaBars, FaGithub, FaEnvelope, FaLinkedinIn, FaRegFileLines, FaXmark } from 'react-icons/fa6';
import { site } from '../data/site';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'About', end: true },
  { to: '/playground', label: 'Playground' },
  { to: '/projects', label: 'Projects' },
];

interface ContactItem {
  href: string;
  label: string;
  Icon: IconType;
  external?: boolean;
}

const CONTACT_ITEMS: ContactItem[] = [
  { href: site.github, label: 'GitHub', Icon: FaGithub, external: true },
  { href: site.linkedin, label: 'LinkedIn', Icon: FaLinkedinIn, external: true },
  { href: `mailto:${site.email}`, label: 'Email', Icon: FaEnvelope },
];

/**
 * Desktop: links on the left, contact icons on the right.
 * Small screens: a menu button that opens the same content as a panel below the bar.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header
      className={styles.header}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
    >
      <button
        type="button"
        className={`${styles.iconLink} ${styles.menuButton}`}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>

      <div id="site-menu" className={open ? `${styles.menu} ${styles.open}` : styles.menu}>
        <nav aria-label="Main">
          <ul className={styles.nav}>
            {NAV_ITEMS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={styles.link} onClick={close}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.contact} aria-label="Contact">
          <li>
            <a
              href={site.cv}
              download
              className={`${styles.iconLink} ${styles.cv}`}
              aria-label="Download CV (PDF)"
            >
              <FaRegFileLines aria-hidden="true" />
              <span className={styles.cvLabel} aria-hidden="true">
                Curriculum Vitae
              </span>
            </a>
          </li>
          {CONTACT_ITEMS.map(({ href, label, Icon, external }) => (
            <li key={href}>
              <a
                href={href}
                className={styles.iconLink}
                aria-label={label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <Icon aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
