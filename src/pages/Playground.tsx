import CardGrid from '../components/CardGrid';
import PlaygroundCard from '../components/PlaygroundCard';
import { playground } from '../data/playground';

export default function Playground() {
  return (
    <>
      <title>Playground – vvs0x.dev</title>
      <h1 className="visually-hidden">Playground</h1>
      <CardGrid snap>
        {playground.map((item) => (
          <PlaygroundCard key={item.id} item={item} />
        ))}
      </CardGrid>
    </>
  );
}
