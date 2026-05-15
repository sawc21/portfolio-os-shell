import { ArrowUpRight, CheckCircle2, Circle, RadioTower, Send } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import {
  budgetSlices,
  habits,
  operatingModes,
  plannerTasks,
  projects,
  resumeHighlights
} from "../../../lib/mockData";
import { runTerminalCommand } from "../../../lib/terminalCommands";
import type { AppId } from "../../../lib/types";

type AppProps = {
  openApp: (appId: AppId) => void;
  launchWorld: () => void;
};

export function ProjectsApp() {
  return (
    <div className="app-view app-view--projects">
      <header className="app-hero">
        <span className="os-label">featured.branches</span>
        <h2>Projects as explorable systems.</h2>
        <p>Each project is framed by role, phase, technical kernel, and the branches explored before the current shape.</p>
      </header>
      <div className="project-stack">
        {projects.map((project) => (
          <article className="project-card" key={project.slug}>
            <div>
              <span>{project.phase}</span>
              <strong>{project.role}</strong>
            </div>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="token-row">
              {project.branches.map((branch) => (
                <span key={branch}>{branch}</span>
              ))}
            </div>
            <a href={`/projects/${project.slug}`}>
              Open case study
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ResumeApp() {
  return (
    <div className="app-view app-view--resume">
      <header className="app-hero">
        <span className="os-label">system.profile</span>
        <h2>Technical credibility with product judgment.</h2>
        <p>Design-minded full-stack developer focused on practical ASP.NET applications and maintainable architecture.</p>
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
      <a className="app-link" href="/resume">Open full resume</a>
    </div>
  );
}

export function ContactApp() {
  return (
    <div className="app-view app-view--contact">
      <header className="app-hero">
        <span className="os-label">network.request</span>
        <h2>Send a clear signal.</h2>
        <p>Placeholder-safe contact routes for the first portfolio OS build. Replace these before publishing.</p>
      </header>
      <div className="contact-stack">
        <a href="mailto:hello@example.com">
          <Send aria-hidden="true" size={18} />
          <span>Email</span>
          <strong>hello@example.com</strong>
        </a>
        <a href="https://github.com/" rel="me">
          <RadioTower aria-hidden="true" size={18} />
          <span>GitHub</span>
          <strong>github.com/your-handle</strong>
        </a>
        <a href="https://www.linkedin.com/" rel="me">
          <RadioTower aria-hidden="true" size={18} />
          <span>LinkedIn</span>
          <strong>linkedin.com/in/your-handle</strong>
        </a>
      </div>
    </div>
  );
}

export function TerminalApp({ openApp, launchWorld }: AppProps) {
  const [lines, setLines] = useState<string[]>([
    "Portfolio OS terminal online.",
    "Type help to list commands."
  ]);
  const [command, setCommand] = useState("");

  function executeCommand() {
    const promptLine = `> ${command || "help"}`;
    const action = runTerminalCommand(command);

    if (action.type === "clear") {
      setLines([]);
      setCommand("");
      return;
    }

    if (action.type === "open") {
      openApp(action.appId);
      setLines((current) => [...current, promptLine, `Opening ${action.appId}...`]);
      setCommand("");
      return;
    }

    if (action.type === "launch-world") {
      launchWorld();
      setLines((current) => [...current, promptLine, "Launching world interface..."]);
      setCommand("");
      return;
    }

    setLines((current) => [...current, promptLine, ...action.lines]);
    setCommand("");
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeCommand();
  }

  function handleCommandKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    executeCommand();
  }

  return (
    <div className="terminal-app" role="application" aria-label="Portfolio OS terminal">
      <div className="terminal-output" aria-live="polite">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form onSubmit={submitCommand}>
        <span>&gt;</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={handleCommandKeyDown}
          aria-label="Terminal command"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}

export function PlannerApp() {
  return (
    <div className="app-view">
      <header className="app-hero">
        <span className="os-label">roadmap.queue</span>
        <h2>Build plan as a board.</h2>
      </header>
      <div className="task-list">
        {plannerTasks.map((task) => (
          <article key={task.title} data-status={task.status}>
            {task.status === "done" ? <CheckCircle2 aria-hidden="true" size={18} /> : <Circle aria-hidden="true" size={18} />}
            <div>
              <strong>{task.title}</strong>
              <span>{task.app} / {task.status}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BudgetApp() {
  const total = useMemo(() => budgetSlices.reduce((sum, slice) => sum + slice.amount, 0), []);

  return (
    <div className="app-view">
      <header className="app-hero">
        <span className="os-label">demo.spend</span>
        <h2>Fake portfolio ops budget.</h2>
        <p>Demo data only. No real personal finance is stored or requested.</p>
      </header>
      <div className="budget-meter" aria-label={`Demo budget total ${total} dollars`}>
        {budgetSlices.map((slice) => (
          <span
            key={slice.label}
            style={{ width: `${(slice.amount / total) * 100}%`, background: slice.color }}
          />
        ))}
      </div>
      <div className="budget-list">
        {budgetSlices.map((slice) => (
          <div key={slice.label}>
            <span style={{ background: slice.color }} />
            <strong>{slice.label}</strong>
            <em>${slice.amount}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HabitsApp() {
  return (
    <div className="app-view">
      <header className="app-hero">
        <span className="os-label">consistency.loop</span>
        <h2>Demo streaks for portfolio growth.</h2>
      </header>
      <div className="habit-grid">
        {habits.map((habit) => (
          <article key={habit.title}>
            <strong>{habit.streak}</strong>
            <span>{habit.title}</span>
            <small>{habit.cadence}</small>
          </article>
        ))}
      </div>
    </div>
  );
}
