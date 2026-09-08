import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Resets the scroll position on route change, as a full page load would. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
