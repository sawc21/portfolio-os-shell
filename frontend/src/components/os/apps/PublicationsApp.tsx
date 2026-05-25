import { ArrowUpRight } from "lucide-react";
import { portfolioCatalog, getPublicationItems } from "../../../lib/portfolioCatalog";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function PublicationsApp({ runAction }: OsAppComponentProps) {
  const publications = getPublicationItems();
  const cv = portfolioCatalog.cv;

  return (
    <div className="app-view app-view--projects">
      <header className="app-hero">
        <span className="os-label">research.cv</span>
        <h2>Publications, research, and CV proof.</h2>
        <p>Resume-sourced paper claims, research roles, industry experience, education, technical strengths, and honors in one OS-native view.</p>
        <div className="app-actions">
          <a className="app-action" href="/cv">
            Open public CV
            <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("resume"))}>
            Open Resume
          </button>
        </div>
      </header>

      <section className="project-stack" aria-label="Publications">
        {publications.map((publication) => (
          <article className="project-card" key={publication.title}>
            <div>
              <span>{publication.category}</span>
              <strong>{publication.status}</strong>
            </div>
            <h3>{publication.title}</h3>
            <p>{publication.sourceContext}</p>
            <small>{publication.citationNote}</small>
            <div className="publication-citation-grid" aria-label={`${publication.title} citation placeholders`}>
              {getCitationPlaceholders(publication).map((status) => (
                <span key={status}>{status}</span>
              ))}
            </div>
            <div className="token-row">
              {publication.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="signal-grid" aria-label="CV sections">
        <CvSection title="Research Experience" items={cv.researchRoles} />
        <CvSection title="Industry Experience" items={cv.industryExperience} />
        <CvSection title="Education" items={cv.education} />
        <CvSection title="Technical Strengths" items={cv.technicalStrengths} />
        <CvSection title="Honors" items={cv.honors} />
      </section>
    </div>
  );
}

function getCitationPlaceholders(publication: {
  citationStatus?: string;
  venueStatus?: string;
  doiStatus?: string;
  pdfStatus?: string;
}) {
  return [publication.citationStatus, publication.venueStatus, publication.doiStatus, publication.pdfStatus].filter(
    (status): status is string => Boolean(status)
  );
}

function CvSection({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="signal-card">
      <span className="os-label">{title.toLowerCase()}</span>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
