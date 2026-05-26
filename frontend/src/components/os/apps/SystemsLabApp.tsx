import { CircuitBoard, PenLine } from "lucide-react";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

const systemsProjectCards = [
  {
    title: "Portfolio OS as a modular shell",
    status: "built",
    summary:
      "The desktop, command routing, search index, and app registry are structured so portfolio features can open apps, route users, and explain project evidence without rewriting the shell.",
    tokens: ["React", "TypeScript", "commands", "search", "typed actions"]
  },
  {
    title: "Workflow surfaces",
    status: "prototype",
    summary:
      "Product experiences are framed as inspectable workflows: input, context, constraints, actions, and verification states.",
    tokens: ["workflow UX", "workflow design", "guardrails", "review states"]
  },
  {
    title: "Automation-ready product apps",
    status: "roadmap",
    summary:
      "Planner, Scope Budget, File Explorer, and Terminal already model the kind of stateful surfaces that can later connect to real automations and external APIs.",
    tokens: ["automation", "stateful UI", "provider layer", "API-ready"]
  }
];

export function SystemsLabApp({ runAction }: OsAppComponentProps) {
  return (
    <div className="app-view app-view--systems-lab">
      <header className="app-hero">
        <span className="os-label">systems.lab</span>
        <h2>Product systems shown as working interfaces.</h2>
        <p>
          Sawyer uses this OS to show modular product interfaces, workflow design, automation surfaces,
          and full-stack product wiring.
        </p>
      </header>
      <div className="project-stack">
        {systemsProjectCards.map((card) => (
          <article className="project-card" key={card.title}>
            <div>
              <span>{card.status}</span>
              <strong>system capability</strong>
            </div>
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
      <div className="app-actions">
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("workflow-console"))}>
          <CircuitBoard aria-hidden="true" size={17} />
          Open Workflow Console
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("projects"))}>
          Open Projects
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("skills"))}>
          Open Skills
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("notes", { query: "workflow" }))}>
          <PenLine aria-hidden="true" size={17} />
          Open Project Notes
        </button>
      </div>
    </div>
  );
}
