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
            {project.featured && project.visualProof ? <ProjectProofStrip project={project} /> : null}
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

function ProjectProofStrip({ project }: { project: CatalogProject }) {
  const proofSlots = project.proofSlots ?? [];

  return (
    <div className="project-proof-strip" aria-label={`${project.title} proof placeholders`}>
      <div className="project-proof-visual" aria-label={project.visualProof?.alt}>
        <span>Placeholder</span>
        <strong>{project.visualProof?.label}</strong>
        <small>{project.visualProof ? formatProofStatus(project.visualProof.status) : "Needs screenshot"}</small>
      </div>
      <div className="project-proof-slots">
        {proofSlots.slice(0, 3).map((slot) => (
          <span key={`${project.slug}-${slot.status}`}>
            <strong>{formatProofStatus(slot.status)}</strong>
            {slot.label}
          </span>
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

function formatProofStatus(status: string) {
  const labels: Record<string, string> = {
    "needs-screenshot": "Needs screenshot",
    "needs-architecture-diagram": "Needs architecture diagram",
    "needs-demo-capture": "Needs demo capture",
    "needs-test-evidence": "Needs test evidence",
    "needs-workflow-diagram": "Needs workflow diagram",
    "needs-output-sample": "Needs output sample",
    "needs-data-model": "Needs data model",
    "needs-runtime-proof": "Needs runtime proof"
  };

  return labels[status] ?? "Placeholder";
}
