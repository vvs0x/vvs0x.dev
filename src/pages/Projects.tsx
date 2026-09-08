import CardGrid from '../components/CardGrid';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <>
      <title>Projects – vvs0x.dev</title>
      <h1 className="visually-hidden">Projects</h1>
      <CardGrid pattern="featured" snap>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </CardGrid>
    </>
  );
}
