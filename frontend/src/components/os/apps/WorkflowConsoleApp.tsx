import { CircuitBoard } from "lucide-react";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

const workflowCards = [
  {
    title: "Observe",
    summary: "Collect task context from OS apps, files, search results, and explicit user intent.",
    tokens: ["context", "search", "source paths"]
  },
  {
    title: "Plan",
    summary: "Break work into small, reviewable steps with visible assumptions and success checks.",
    tokens: ["task planning", "scope", "risk"]
  },
  {
    title: "Act",
    summary: "Use typed system actions to open apps, copy paths, route searches, or hand off to future integrations.",
    tokens: ["tools", "commands", "actions"]
  },
  {
    title: "Verify",
    summary: "Treat tests, build output, browser checks, and source diffs as first-class completion evidence.",
    tokens: ["tests", "build", "browser QA"]
  }
];

export function WorkflowConsoleApp({ runAction }: OsAppComponentProps) {
  return (
    <div className="app-view app-view--workflow-console">
      <header className="app-hero">
        <span className="os-label">workflow.console</span>
        <h2>How product workflows move through the OS.</h2>
        <p>
          This console maps a pattern for future apps: visible context, typed actions, clear
          guardrails, and verification before state changes.
        </p>
      </header>
      <div className="skill-grid">
        {workflowCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.summary}</p>
            <div className="token-row">
              {card.tokens.map((token) => (
                <span key={token}>{token}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <section className="case-note">
        <strong>Integration rule</strong>
        <p>
          New workflow apps should register through the OS app registry, communicate through typed
          system actions, and keep outputs visibly reviewable before they affect user state.
        </p>
      </section>
      <div className="app-actions">
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("systems-lab"))}>
          <CircuitBoard aria-hidden="true" size={17} />
          Open Systems Lab
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("terminal", { command: "apps" }))}>
          Open Terminal Apps List
        </button>
      </div>
    </div>
  );
}
