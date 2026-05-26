import { getResumeDownload } from "../../../lib/portfolioProfile";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function ResumeApp({ runAction }: OsAppComponentProps) {
  const profile = portfolioKernel.getRecruiterProfile();
  const resumeHighlights = portfolioKernel.getResumeHighlights();
  const operatingModes = portfolioKernel.getOperatingModes();
  const resumeDownload = getResumeDownload();

  return (
    <div className="app-view app-view--resume">
      <header className="app-hero">
        <span className="os-label">system.profile</span>
        <h2>AI, cybersecurity, and backend systems profile.</h2>
        <p>{profile.shortPitch}</p>
      </header>
      <section className="resume-grid">
        <div>
          <h3>Core stack</h3>
          <ul>
            {resumeHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Operating modes</h3>
          <ul>
            {operatingModes.map((mode) => (
              <li key={mode}>{mode}</li>
            ))}
          </ul>
        </div>
      </section>
      <a className="app-link" href="/resume">Open server resume route</a>
      <button
        className="app-action"
        type="button"
        onClick={() => runAction(portfolioKernel.actions.downloadUrl(resumeDownload.href, resumeDownload.filename))}
      >
        Download Resume PDF
      </button>
      <button className="app-action" type="button" onClick={() => runAction(portfolioKernel.actions.openApp("recruiter"))}>
        Hire Sawyer Cawthon
      </button>
    </div>
  );
}
