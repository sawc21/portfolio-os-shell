import { useEffect, useId, useRef } from "react";
import { BriefcaseBusiness, FileText, GitBranch, Mail, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import sawyerLoginPortrait from "../../assets/profile/sawyer-login.webp";

export type LoginScreenStatus = "idle" | "error" | "success";

export type LoginScreenProps = {
  phrase: string;
  status: LoginScreenStatus;
  message: string;
  submitting: boolean;
  onPhraseChange: (value: string) => void;
  onSubmit: () => void;
};

type LoginQuickLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const loginQuickLinks: LoginQuickLink[] = [
  { label: "GitHub", href: "https://github.com/sawc21", icon: GitBranch, external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: BriefcaseBusiness, external: true },
  { label: "X", href: "https://x.com/", icon: X, external: true },
  { label: "Email", href: "mailto:hello@example.com", icon: Mail },
  { label: "Resume", href: "/resume", icon: FileText }
];

export function LoginScreen({
  phrase,
  status,
  message,
  submitting,
  onPhraseChange,
  onSubmit
}: LoginScreenProps) {
  const inputId = useId();
  const feedbackId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (status === "error") {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [status, message]);

  return (
    <section className="login-screen" data-status={status} aria-label="Portfolio OS login">
      <div className="login-screen__backdrop" aria-hidden="true" />
      <form
        className="login-screen__panel"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="login-screen__portrait-frame">
          <img src={sawyerLoginPortrait} alt="Sawyer Cawthon" />
        </div>
        <div className="login-screen__content">
          <span className="os-label">kernel.gallery</span>
          <h1>Sawyer Cawthon</h1>
          <p>AI Portfolio Operating System</p>
          <p className="login-screen__about">
            AI-focused developer building agent-ready product interfaces, LLM workflow
            prototypes, React/TypeScript apps, ASP.NET Core systems, and practical automation.
          </p>
          <div className="login-screen__focus-list" aria-label="Sawyer's core work">
            <span>AI prototypes</span>
            <span>LLM workflows</span>
            <span>React + TypeScript</span>
            <span>ASP.NET Core + C#</span>
            <span>Tool-ready UX</span>
          </div>
          <div className="login-screen__phrase-card" aria-label="Required login phrase">
            <span>type exactly</span>
            <strong>Hire Sawyer</strong>
          </div>
          <p className="login-screen__helper">Enter the phrase above to boot the desktop.</p>
          <nav className="login-screen__quick-links" aria-label="Sawyer quick links">
            {loginQuickLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target={external ? "_blank" : undefined}
                rel={external ? "me noopener noreferrer" : undefined}
              >
                <Icon aria-hidden="true" size={15} strokeWidth={2.4} />
                <span>{label}</span>
              </a>
            ))}
          </nav>
          <label htmlFor={inputId}>access phrase (case-sensitive)</label>
          <div className="login-screen__input-wrap">
            <span className="login-screen__status-light" aria-hidden="true" />
            <input
              id={inputId}
              ref={inputRef}
              value={phrase}
              onChange={(event) => onPhraseChange(event.target.value)}
              aria-describedby={feedbackId}
              autoComplete="off"
              disabled={submitting}
              placeholder="Hire Sawyer"
              spellCheck={false}
            />
          </div>
          <div
            id={feedbackId}
            className="login-screen__feedback"
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Booting..." : "Log on"}
          </button>
        </div>
      </form>
    </section>
  );
}
