import { Bot, CircuitBoard } from "lucide-react";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

const aiProjectCards = [
  {
    title: "Portfolio OS as an agent-ready shell",
    status: "built",
    summary:
      "The desktop, command routing, search index, and app registry are structured so future AI tools can open apps, route users, and explain portfolio evidence without rewriting the shell.",
    tokens: ["React", "TypeScript", "commands", "search", "tool actions"]
  },
  {
    title: "Model workflow surfaces",
    status: "prototype",
    summary:
      "AI experiences are framed as inspectable workflows: input, context, guardrails, actions, and verification states instead of a vague text box.",
    tokens: ["LLM UX", "workflow design", "guardrails", "review states"]
  },
  {
    title: "Automation-ready product apps",
    status: "roadmap",
    summary:
      "Planner, Scope Budget, File Explorer, and Terminal already model the kind of stateful surfaces that can later connect to real automations and external APIs.",
    tokens: ["automation", "stateful UI", "provider layer", "API-ready"]
  }
];

export function AiLabApp({ runAction }: OsAppComponentProps) {
  return (
    <div className="app-view app-view--ai-lab">
      <header className="app-hero">
        <span className="os-label">ai.capabilities</span>
        <h2>AI projects shown as product systems.</h2>
        <p>
          Sawyer is positioning this OS around practical AI capability: agent-ready interfaces,
          LLM workflow design, automation surfaces, and full-stack product wiring.
        </p>
      </header>
      <div className="project-stack">
        {aiProjectCards.map((card) => (
          <article className="project-card" key={card.title}>
            <div>
              <span>{card.status}</span>
              <strong>AI capability</strong>
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
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("agent-console"))}>
          <CircuitBoard aria-hidden="true" size={17} />
          Open Agent Console
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("projects"))}>
          Open Projects
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("skills"))}>
          Open Skills
        </button>
        <button type="button" className="app-action" onClick={() => runAction(portfolioKernel.actions.openApp("notes", { query: "agent" }))}>
          <Bot aria-hidden="true" size={17} />
          Open AI Notes
        </button>
      </div>
    </div>
  );
}
