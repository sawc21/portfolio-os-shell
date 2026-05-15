import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  RadioTower,
  Rocket,
  Send,
  TerminalSquare
} from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import {
  aboutProfile,
  budgetSlices,
  caseStudies,
  habits,
  notes,
  operatingModes,
  plannerTasks,
  projects,
  resumeHighlights,
  skillGroups,
  worldRoadmap
} from "../../../lib/mockData";
import { runTerminalCommand } from "../../../lib/terminalCommands";
import type { AppId } from "../../../lib/types";

export type OsAppComponentProps = {
  openApp: (appId: AppId) => void;
  launchWorld: () => void;
};

export function AboutApp() {
  return (
    <div className="app-view app-view--about">
      <header className="app-hero">
        <span className="os-label">profile.boot</span>
        <h2>{aboutProfile.headline}</h2>
        <p>{aboutProfile.summary}</p>
      </header>
      <div className="signal-grid">
        {aboutProfile.signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
      <section className="case-note">
        <strong>Interview angle</strong>
        <p>
          Recruiters can inspect the portfolio as a product: the OS shell demonstrates UI state,
          interaction design, frontend architecture, and a backend that still serves durable routes.
        </p>
      </section>
    </div>
  );
}

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
              Open server route
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SkillsApp() {
  return (
    <div className="app-view app-view--skills">
      <header className="app-hero">
        <span className="os-label">capability.map</span>
        <h2>Skills grouped by how the portfolio is built.</h2>
        <p>Practical full-stack capabilities, UI architecture, and creative technology direction.</p>
      </header>
      <div className="skill-grid">
        {skillGroups.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <div className="token-row">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CaseStudiesApp() {
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
    </div>
  );
}

export function NotesApp() {
  return (
    <div className="app-view">
      <header className="app-hero">
        <span className="os-label">thinking.log</span>
        <h2>Notes stay available inside the OS.</h2>
        <p>Server-rendered blog routes remain stable, while the desktop presents the same content as files.</p>
      </header>
      <div className="notes-list">
        {notes.map((note) => (
          <a key={note.slug} href={`/blog/${note.slug}`}>
            <span>{note.date}</span>
            <strong>{note.title}</strong>
            <p>{note.summary}</p>
          </a>
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
      <a className="app-link" href="/resume">Open server resume route</a>
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

export function TerminalApp({ openApp, launchWorld }: OsAppComponentProps) {
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

export function WorldApp({ launchWorld }: OsAppComponentProps) {
  return (
    <div className="app-view app-view--world">
      <header className="app-hero">
        <span className="os-label">world.prototype</span>
        <h2>3D mode stays focused and small.</h2>
        <p>
          The current launch flow is a CSS spatial prototype. The next technical branch can replace
          it with React Three Fiber and Drei without disturbing the OS shell.
        </p>
      </header>
      <div className="roadmap-list">
        {worldRoadmap.map((item) => (
          <article key={item}>
            <TerminalSquare aria-hidden="true" size={18} />
            <span>{item}</span>
          </article>
        ))}
      </div>
      <button className="app-action" type="button" onClick={launchWorld}>
        <Rocket aria-hidden="true" size={17} />
        Run boot sequence
      </button>
    </div>
  );
}
