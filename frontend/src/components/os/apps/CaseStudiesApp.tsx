import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function CaseStudiesApp({ runAction }: OsAppComponentProps) {
  const caseStudies = portfolioKernel.getCaseStudies();

  return (
    <div className="app-view app-view--cases">
      <header className="app-hero">
        <span className="os-label">case.study</span>
        <h2>Architecture decisions written for interviews.</h2>
        <p>The OS includes its own case study so the interface explains the engineering choices behind it.</p>
      </header>
      <div className="project-stack">
        {caseStudies.map((study) => (
          <article className="project-card" key={study.title}>
            <div>
              <span>{study.status}</span>
              <strong>portfolio proof</strong>
            </div>
            <h3>{study.title}</h3>
            <p>{study.summary}</p>
            <div className="token-row">
              {study.proof.map((proof) => (
                <span key={proof}>{proof}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("recruiter"))}>
        Open Recruiter Quick View
      </button>
    </div>
  );
}
