import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function RecruiterApp({ runAction }: OsAppComponentProps) {
  const profile = portfolioKernel.getRecruiterProfile();
  const signals = portfolioKernel.getPortfolioSignals();
  const featuredProjects = portfolioKernel.getProjects().slice(0, 2);

  return (
    <div className="app-view app-view--recruiter">
      <header className="app-hero">
        <span className="os-label">hire.signal</span>
        <h2>Hire Sawyer Cawthon.</h2>
        <p>{profile.valueProposition}</p>
      </header>
      <div className="signal-grid">
        {profile.targetRoles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </div>
      <section className="case-note">
        <strong>Role positioning</strong>
        <p>{profile.shortPitch}</p>
      </section>
      <section className="skill-grid" aria-label="Strongest technical skills">
        <article>
          <h3>Strongest skills</h3>
          <div className="token-row">
            {profile.skills.slice(0, 8).map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
        <article>
          <h3>Research and work highlights</h3>
          <ul>
            {profile.workHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </section>
      <div className="project-stack">
        {signals.map((signal) => (
          <article className="project-card" key={signal.title}>
            <div>
              <span>proof</span>
              <strong>portfolio signal</strong>
            </div>
            <h3>{signal.title}</h3>
            <p>{signal.description}</p>
            <div className="token-row">
              {signal.keywords.slice(0, 5).map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </article>
        ))}
        {featuredProjects.map((project) => (
          <article className="project-card" key={project.slug}>
            <div>
              <span>{project.phase}</span>
              <strong>{project.role}</strong>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="token-row">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="app-actions">
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("resume"))}>Open Resume</button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("projects"))}>Open Projects</button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("case-studies"))}>Open Case Studies</button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("contact"))}>Contact</button>
      </div>
    </div>
  );
}
