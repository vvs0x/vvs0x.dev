import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { LuFileText, LuGithub, LuLinkedin, LuMail } from 'react-icons/lu';
import { site } from '../data/site';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { to: '/about', label: 'About' },
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
  { href: site.github, label: 'GitHub', Icon: LuGithub, external: true },
  { href: site.linkedin, label: 'LinkedIn', Icon: LuLinkedin, external: true },
  { href: `mailto:${site.email}`, label: 'Email', Icon: LuMail },
];

/** Same mark as the favicon. */
function LogoMark() {
  return (
    <svg className={styles.logoMark} viewBox="0 0 32 32" aria-hidden="true">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5.75 L12.5 14 L4 22.25" />
        <path d="M13.5 26 H28" />
      </g>
    </svg>
  );
}

/** Two thin lines, or a cross while the menu is open. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? <path d="M6 6 L18 18 M18 6 L6 18" /> : <path d="M3 9 H21 M3 15 H21" />}
    </svg>
  );
}

/**
 * Desktop: logo and links on the left, contact icons on the right.
 * Phones: logo on the left, menu button on the right. The menu opens as a
 * full-screen layer in the opposite colours of the page (dark in light mode,
 * light in dark mode); logo and button stay where they are on top of it.
 */
export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Any navigation closes the menu, including the browser's back button.
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // While the menu covers the screen the page behind it must not scroll. It
  // also closes when the window grows past the phone layout.
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    root.style.overflow = 'hidden';

    const phone = window.matchMedia('(max-width: 40em)');
    const onChange = () => {
      if (!phone.matches) setOpen(false);
    };
    phone.addEventListener('change', onChange);

    return () => {
      root.style.overflow = '';
      phone.removeEventListener('change', onChange);
    };
  }, [open]);

  return (
    <header
      className={styles.header}
      data-open={open || undefined}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
    >
      <Link to="/" className={styles.logo} aria-label="Home" onClick={close}>
        <LogoMark />
      </Link>

      <button
        type="button"
        className={`${styles.iconLink} ${styles.menuButton}`}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon open={open} />
      </button>

      <div id="site-menu" className={open ? `${styles.menu} ${styles.open}` : styles.menu}>
        <nav aria-label="Main">
          <ul className={styles.nav}>
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={styles.link} onClick={close}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle className={styles.theme} />

        <ul className={styles.contact} aria-label="Contact">
          <li>
            <a
              href={site.cv}
              download
              className={`${styles.iconLink} ${styles.cv}`}
              aria-label="Download CV (PDF)"
            >
              <LuFileText aria-hidden="true" />
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
