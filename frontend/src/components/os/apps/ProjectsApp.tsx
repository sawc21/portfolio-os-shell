import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { getCatalogProjects } from "../../../lib/portfolioCatalog";
import type { CatalogProject } from "../../../lib/types";

export function ProjectsApp() {
  const projects = getCatalogProjects();
  const [filter, setFilter] = useState<"featured" | "all" | "sources">("featured");
  const visibleProjects = useMemo(() => {
    if (filter === "featured") {
      return projects.filter((project) => project.featured);
    }

    if (filter === "sources") {
      return projects.filter((project) => project.sourceType === "github" || project.sourceType === "local-git");
    }

    return projects;
  }, [filter, projects]);

  return (
    <div className="app-view app-view--projects">
      <header className="app-hero">
        <span className="os-label">catalog.index</span>
        <h2>Projects as a complete technical catalog.</h2>
        <p>Featured work stays up front, while the archive keeps GitHub and meaningful local repos visible without pretending every repo is equally polished.</p>
        <div className="app-actions" role="group" aria-label="Project filters">
          <FilterButton active={filter === "featured"} onClick={() => setFilter("featured")}>Featured</FilterButton>
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All Projects</FilterButton>
          <FilterButton active={filter === "sources"} onClick={() => setFilter("sources")}>GitHub / Local</FilterButton>
        </div>
      </header>
      <div className="project-stack">
        {visibleProjects.map((project) => (
          <article className="project-card" key={project.slug}>
            <div>
              <span>{project.featured ? "featured" : "archive"}</span>
              <strong>{project.role}</strong>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <small>{project.phase} / {formatSource(project)}</small>
            <div className="token-row">
              {[...project.tags, ...project.branches].slice(0, 8).map((branch) => (
                <span key={branch}>{branch}</span>
              ))}
            </div>
            <div className="app-actions">
              {project.caseStudyPath ? (
                <a href={project.caseStudyPath}>
                  Open case study
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ) : null}
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noreferrer">
                  Open source
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={active ? "app-action is-active" : "app-action"} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

function formatSource(project: CatalogProject) {
  if (project.repoUrl) {
    return project.repoUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  return project.localPathLabel;
}
