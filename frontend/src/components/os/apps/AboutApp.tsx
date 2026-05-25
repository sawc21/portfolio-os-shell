import { portfolioKernel } from "../../../os/kernel/kernel";

export function AboutApp() {
  const profile = portfolioKernel.getRecruiterProfile();
  const signals = portfolioKernel.getPortfolioSignals();

  return (
    <div className="app-view app-view--about">
      <header className="app-hero">
        <span className="os-label">profile.boot</span>
        <h2>{profile.name} builds portfolio software like a product.</h2>
        <p>{profile.shortPitch}</p>
      </header>
      <div className="signal-grid">
        {profile.targetRoles.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
      <section className="case-note">
        <strong>Interview angle</strong>
        <p>{signals[0]?.description}</p>
      </section>
    </div>
  );
}
