/*
 * Light / dark mode. The theme lives in <html data-theme="…">; index.html
 * sets it before the first paint, the switch in the navbar changes it.
 */

export type Theme = 'light' | 'dark';

/** Browser bar colour per theme; the same values as --color-bg. */
const THEME_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#16171c' };

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* storage blocked: the choice simply isn't remembered */
  }
}
