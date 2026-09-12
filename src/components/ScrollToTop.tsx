import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route change, jump to the top as a full page load would, or to the
 * element named in the URL hash if there is one.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
