import { portfolioKernel } from "../../../os/kernel/kernel";

export function SkillsApp() {
  const skillGroups = portfolioKernel.getSkillGroups();

  return (
    <div className="app-view app-view--skills">
      <header className="app-hero">
        <span className="os-label">capability.map</span>
        <h2>Skills grouped by how the portfolio is built.</h2>
        <p>Practical full-stack capabilities, UI architecture, and creative technology direction.</p>
      </header>
      <div className="skill-grid">
        {skillGroups.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <div className="token-row">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
