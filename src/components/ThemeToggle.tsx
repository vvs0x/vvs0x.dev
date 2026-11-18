import { useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { getTheme, setTheme, type Theme } from '../theme';
import styles from './ThemeToggle.module.css';

/** Pill switch between light and dark mode; the knob shows the current mode. */
export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={() => {
        const next = dark ? 'light' : 'dark';
        setTheme(next);
        setThemeState(next);
      }}
    >
      <span className={styles.knob} aria-hidden="true">
        {dark ? <LuMoon /> : <LuSun />}
      </span>
    </button>
  );
}
