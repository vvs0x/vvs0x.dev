import CardGrid from '../components/CardGrid';
import EntryCard from '../components/EntryCard';
import { playground } from '../data/playground';
import { pageTitle } from '../utils/pageTitle';

export default function Playground() {
  return (
    <>
      <title>{pageTitle('Playground')}</title>
      <h1 className="visually-hidden">Playground</h1>
      <CardGrid>
        {playground.map((item) => (
          <EntryCard key={item.id} entry={item} basePath="/playground" />
        ))}
      </CardGrid>
    </>
  );
}
