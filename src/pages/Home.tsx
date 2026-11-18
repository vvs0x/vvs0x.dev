import Hero from '../components/hero/Hero';
import { pageTitle } from '../utils/pageTitle';

/** Start page at "/", reached through the logo. */
export default function Home() {
  return (
    <>
      <title>{pageTitle('Home')}</title>
      <Hero />
    </>
  );
}
