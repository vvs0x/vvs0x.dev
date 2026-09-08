import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import About from './pages/About';
import Projects from './pages/Projects';
import Playground from './pages/Playground';
import EntryDetail from './pages/EntryDetail';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<EntryDetail collection="projects" />} />
          <Route path="playground" element={<Playground />} />
          <Route path="playground/:id" element={<EntryDetail collection="playground" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
