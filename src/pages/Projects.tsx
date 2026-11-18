import CardGrid from '../components/CardGrid';
import EntryCard from '../components/EntryCard';
import { projects } from '../data/projects';
import { pageTitle } from '../utils/pageTitle';

export default function Projects() {
  return (
    <>
      <title>{pageTitle('Projects')}</title>
      <h1 className="visually-hidden">Projects</h1>
      <CardGrid>
        {projects.map((project) => (
          <EntryCard key={project.id} entry={project} basePath="/projects" />
        ))}
      </CardGrid>
    </>
  );
}
