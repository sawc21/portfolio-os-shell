import { RadioTower, Send } from "lucide-react";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function ContactApp({ runAction }: OsAppComponentProps) {
  const profile = portfolioKernel.getRecruiterProfile();

  return (
    <div className="app-view app-view--contact">
      <header className="app-hero">
        <span className="os-label">network.request</span>
        <h2>Send a clear signal.</h2>
        <p>{profile.valueProposition}</p>
      </header>
      <div className="contact-stack">
        {profile.contactLinks.map((link) => (
          <a key={link.label} href={link.href} rel={link.href.startsWith("http") ? "me" : undefined}>
            {link.label === "Email" ? <Send aria-hidden="true" size={18} /> : <RadioTower aria-hidden="true" size={18} />}
            <span>{link.label}</span>
            <strong>{link.value}</strong>
          </a>
        ))}
      </div>
      <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("recruiter"))}>
        Hire Sawyer Cawthon
      </button>
    </div>
  );
}
