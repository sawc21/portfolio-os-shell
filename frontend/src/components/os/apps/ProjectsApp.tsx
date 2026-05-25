import { ArrowUpRight } from "lucide-react";
import { portfolioKernel } from "../../../os/kernel/kernel";

export function ProjectsApp() {
  const projects = portfolioKernel.getProjects();

  return (
    <div className="app-view app-view--projects">
      <header className="app-hero">
        <span className="os-label">featured.branches</span>
        <h2>Projects as explorable systems.</h2>
        <p>Each project is framed by role, phase, technical kernel, and the branches explored before the current shape.</p>
      </header>
      <div className="project-stack">
        {projects.map((project) => (
          <article className="project-card" key={project.slug}>
            <div>
              <span>{project.phase}</span>
              <strong>{project.role}</strong>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="token-row">
              {project.branches.map((branch) => (
                <span key={branch}>{branch}</span>
              ))}
            </div>
            <a href={`/projects/${project.slug}`}>
              Open server route
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
