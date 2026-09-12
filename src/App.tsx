import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';
import Projects from './pages/Projects';
import EntryDetail from './pages/EntryDetail';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';

/*
 * The Playground grid is covered by a "Coming soon" page for now.
 * To bring it back: import Playground from './pages/Playground' and swap
 * the element of the "playground" route below. Page, cards and data are
 * all still in place.
 */

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<EntryDetail collection="projects" />} />
          <Route path="playground" element={<ComingSoon title="Playground" />} />
          <Route path="playground/:id" element={<EntryDetail collection="playground" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
