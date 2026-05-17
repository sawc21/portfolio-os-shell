import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Copy,
  FileCode2,
  Folder,
  RadioTower,
  Rocket,
  Search,
  Send,
  SlidersHorizontal,
  TerminalSquare
} from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { AppId, FileSystemEntry, ScopeScenarioInput, SystemAction } from "../../../lib/types";

export type OsAppComponentProps = {
  openApp: (appId: AppId, params?: unknown) => void;
  launchWorld: () => void;
  resetWorkspace: () => void;
  params?: unknown;
};

export function AboutApp() {
  const profile = portfolioKernel.getRecruiterProfile();
  const signals = portfolioKernel.getPortfolioSignals();

  return (
    <div className="app-view app-view--about">
      <header className="app-hero">
        <span className="os-label">profile.boot</span>
        <h2>{profile.name} builds portfolio software like a product.</h2>
        <p>{profile.shortPitch}</p>
      </header>
      <div className="signal-grid">
        {profile.targetRoles.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
      <section className="case-note">
        <strong>Interview angle</strong>
        <p>{signals[0]?.description}</p>
      </section>
    </div>
  );
}

export function RecruiterApp({ openApp }: OsAppComponentProps) {
  const profile = portfolioKernel.getRecruiterProfile();
  const signals = portfolioKernel.getPortfolioSignals();

  return (
    <div className="app-view app-view--recruiter">
      <header className="app-hero">
        <span className="os-label">hire.signal</span>
        <h2>Hire Sawyer Cawthon.</h2>
        <p>{profile.valueProposition}</p>
      </header>
      <div className="signal-grid">
        {profile.targetRoles.map((role) => (
          <span key={role}>{role}</span>
        ))}
      </div>
      <div className="project-stack">
        {signals.map((signal) => (
          <article className="project-card" key={signal.title}>
            <div>
              <span>proof</span>
              <strong>portfolio signal</strong>
            </div>
            <h3>{signal.title}</h3>
            <p>{signal.description}</p>
            <div className="token-row">
              {signal.keywords.slice(0, 5).map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="app-actions">
        <button type="button" className="app-action" onClick={() => openApp("resume")}>Open Resume</button>
        <button type="button" className="app-action" onClick={() => openApp("projects")}>View Project Proof</button>
        <button type="button" className="app-action" onClick={() => openApp("contact")}>Contact Sawyer</button>
      </div>
    </div>
  );
}

export function SearchApp({ openApp, params }: OsAppComponentProps) {
  const initialQuery = typeof params === "object" && params !== null && "query" in params
    ? String((params as { query?: string }).query ?? "")
    : "hire sawyer";
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => portfolioKernel.search(query), [query]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function runAction(action: SystemAction) {
    if (action.type === "open-app") {
      openApp(action.appId);
    }
    if (action.type === "open-search") {
      setQuery(action.query);
    }
  }

  return (
    <div className="app-view app-view--search">
      <header className="app-hero">
        <span className="os-label">kernel.search</span>
        <h2>Sawyer Search</h2>
        <p>Search apps, projects, skills, commands, case studies, and hiring signals.</p>
      </header>
      <label className="search-box">
        <Search aria-hidden="true" size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search the Portfolio OS"
          placeholder="try hire sawyer, react, testing, 3d"
        />
      </label>
      <div className="search-results">
        {results.map((result) => (
          <button key={result.id} type="button" onClick={() => runAction(result.action)}>
            <span>{result.category}</span>
            <strong>{result.title}</strong>
            <p>{result.description}</p>
            <small>{result.keywords.slice(0, 5).join(" / ")}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FileExplorerApp({ openApp }: OsAppComponentProps) {
  const entries = portfolioKernel.getFileSystemEntries();
  const directories = Array.from(new Set(entries.map((entry) => entry.directory)));
  const [activeDirectory, setActiveDirectory] = useState(directories[0] ?? "");
  const [selectedEntry, setSelectedEntry] = useState<FileSystemEntry | null>(entries[0] ?? null);
  const visibleEntries = entries.filter((entry) => entry.directory === activeDirectory);

  function openEntry(entry: FileSystemEntry) {
    setSelectedEntry(entry);

    if (entry.appId) {
      openApp(entry.appId);
      return;
    }

    if (entry.href) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
      return;
    }

    if (entry.sourcePath) {
      void navigator.clipboard?.writeText(entry.sourcePath);
    }
  }

  return (
    <div className="file-explorer">
      <nav className="file-explorer__menubar" aria-label="File Explorer menu">
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">View</button>
        <button type="button">Favorites</button>
        <button type="button">Tools</button>
        <button type="button">Help</button>
      </nav>
      <header className="file-explorer__toolbar">
        <button type="button" aria-label="Back">Back</button>
        <button type="button" aria-label="Forward">Forward</button>
        <button type="button" onClick={() => openApp("search")}>Search</button>
        <button type="button" onClick={() => openApp("files")}>Folders</button>
        <label>
          Address
          <input value={activeDirectory} onChange={(event) => setActiveDirectory(event.target.value)} />
        </label>
      </header>
      <div className="file-explorer__body">
        <aside className="file-explorer__tree" aria-label="Portfolio directories">
          {directories.map((directory) => (
            <button
              key={directory}
              type="button"
              className={directory === activeDirectory ? "is-active" : undefined}
              onClick={() => setActiveDirectory(directory)}
            >
              <Folder aria-hidden="true" size={16} />
              <span>{directory}</span>
            </button>
          ))}
        </aside>
        <section className="file-explorer__files" aria-label="Directory contents">
          <div className="file-explorer__head">
            <span>Name</span>
            <span>Type</span>
            <span>Directory</span>
          </div>
          {visibleEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={selectedEntry?.id === entry.id ? "is-selected" : undefined}
              onClick={() => openEntry(entry)}
            >
              <span className="file-explorer__name">
                {entry.kind === "source" ? <FileCode2 aria-hidden="true" size={18} /> : <Folder aria-hidden="true" size={18} />}
                <strong>{entry.name}</strong>
              </span>
              <span>{entry.kind}</span>
              <small>{entry.directory}</small>
            </button>
          ))}
        </section>
      </div>
      <footer className="file-explorer__details">
        {selectedEntry ? (
          <>
            <strong>{selectedEntry.name}</strong>
            <span>{selectedEntry.description}</span>
            <code>{selectedEntry.sourcePath ?? selectedEntry.href ?? selectedEntry.directory}</code>
            {selectedEntry.sourcePath ? (
              <button type="button" onClick={() => void navigator.clipboard?.writeText(selectedEntry.sourcePath ?? "")}>
                <Copy aria-hidden="true" size={14} />
                Copy source path
              </button>
            ) : null}
          </>
        ) : (
          <span>Select a file to inspect its path and action.</span>
        )}
      </footer>
    </div>
  );
}

export function ProjectsApp() {
  const projects = portfolioKernel.getProjects();

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
  const skillGroups = portfolioKernel.getSkillGroups();

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

export function CaseStudiesApp({ openApp }: OsAppComponentProps) {
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
      <button type="button" className="app-action" onClick={() => openApp("recruiter")}>
        Open Recruiter Quick View
      </button>
    </div>
  );
}

export function NotesApp() {
  const notes = portfolioKernel.getNotes();

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

export function ResumeApp({ openApp }: OsAppComponentProps) {
  const profile = portfolioKernel.getRecruiterProfile();
  const resumeHighlights = portfolioKernel.getResumeHighlights();
  const operatingModes = portfolioKernel.getOperatingModes();

  return (
    <div className="app-view app-view--resume">
      <header className="app-hero">
        <span className="os-label">system.profile</span>
        <h2>Technical credibility with product judgment.</h2>
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
      <button className="app-action" type="button" onClick={() => openApp("recruiter")}>
        Hire Sawyer Cawthon
      </button>
    </div>
  );
}

export function ContactApp({ openApp }: OsAppComponentProps) {
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
      <button type="button" className="app-action" onClick={() => openApp("recruiter")}>
        Hire Sawyer Cawthon
      </button>
    </div>
  );
}

export function TerminalApp({ openApp, launchWorld, resetWorkspace }: OsAppComponentProps) {
  const [lines, setLines] = useState<string[]>([
    "Portfolio OS terminal online.",
    "Type help to list commands."
  ]);
  const [command, setCommand] = useState("");

  function executeCommand() {
    const promptLine = `> ${command || "help"}`;
    const action = portfolioKernel.runCommand(command);

    if (action.type === "clear") {
      setLines([]);
      setCommand("");
      return;
    }

    if (action.type === "open-app") {
      openApp(action.appId);
      setLines((current) => [...current, promptLine, `Opening ${action.appId}...`]);
      setCommand("");
      return;
    }

    if (action.type === "open-search") {
      openApp("search", { query: action.query });
      const results = portfolioKernel.search(action.query);
      setLines((current) => [
        ...current,
        promptLine,
        `Searching for ${action.query}...`,
        ...results.slice(0, 4).map((result) => `${result.category}: ${result.title}`)
      ]);
      setCommand("");
      return;
    }

    if (action.type === "launch-world") {
      launchWorld();
      setLines((current) => [...current, promptLine, "Launching world interface..."]);
      setCommand("");
      return;
    }

    if (action.type === "reset-os") {
      resetWorkspace();
      setLines((current) => [...current, promptLine, "Portfolio OS workspace and demo state reset."]);
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
  const [planner, setPlanner] = useState(() => portfolioKernel.getSprintPlannerData());

  return (
    <div className="app-view app-view--planner">
      <header className="app-hero">
        <span className="os-label">sprint.planner</span>
        <h2>{planner.currentSprint}</h2>
        <p>{planner.sprintGoal}</p>
      </header>
      <div className="token-row">
        {planner.roadmap.map((phase) => (
          <span key={phase}>{phase}</span>
        ))}
      </div>
      <div className="task-list">
        {planner.tasks.map((task) => (
          <article key={task.title} data-status={task.status}>
            {task.status === "done" ? <CheckCircle2 aria-hidden="true" size={18} /> : <Circle aria-hidden="true" size={18} />}
            <div>
              <strong>{task.title}</strong>
              <span>{task.area} / {task.status} / {task.tags.join(", ")}</span>
            </div>
            <button
              type="button"
              className="inline-action"
              onClick={() => setPlanner(portfolioKernel.updateSprintTaskStatus(task.id, nextTaskStatus(task.status)))}
            >
              Move to {nextTaskStatus(task.status)}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export function BudgetApp() {
  const [scope, setScope] = useState(() => portfolioKernel.getScopeBudgetData());
  const total = useMemo(() => scope.items.reduce((sum, item) => sum + item.value, 0), [scope.items]);
  const averageRecruiterValue = Math.round(
    scope.items.reduce((sum, item) => sum + item.recruiterValue, 0) / scope.items.length
  );

  function updateScenario(input: ScopeScenarioInput) {
    setScope(portfolioKernel.updateScopeScenario(input));
  }

  return (
    <div className="app-view app-view--budget">
      <header className="app-hero">
        <span className="os-label">scope.budget</span>
        <h2>Time, complexity, and recruiter value.</h2>
        <p>Mock planning data for portfolio tradeoffs. No personal finance is stored or requested.</p>
      </header>
      <div className="scope-controls">
        <label>
          Polish bias
          <input
            type="range"
            min="0"
            max="100"
            value={scope.scenario.polishBias}
            onChange={(event) => updateScenario({ ...scope.scenario, polishBias: Number(event.target.value) })}
          />
          <span>{scope.scenario.polishBias}%</span>
        </label>
        <label>
          3D bias
          <input
            type="range"
            min="0"
            max="100"
            value={scope.scenario.threeDBias}
            onChange={(event) => updateScenario({ ...scope.scenario, threeDBias: Number(event.target.value) })}
          />
          <span>{scope.scenario.threeDBias}%</span>
        </label>
      </div>
      <div className="budget-meter" aria-label={`Demo budget total ${total} dollars`}>
        {scope.items.map((slice) => (
          <span
            key={slice.label}
            style={{ width: `${(slice.value / total) * 100}%`, background: slice.color }}
          />
        ))}
      </div>
      <p className="app-metric">Average recruiter value: {averageRecruiterValue}/100</p>
      <div className="budget-list">
        {scope.items.map((slice) => (
          <div key={slice.label}>
            <span style={{ background: slice.color }} />
            <strong>{slice.label}</strong>
            <em>{slice.value} {slice.unit} / {slice.risk} risk</em>
          </div>
        ))}
      </div>
      <div className="roadmap-list">
        {scope.items.map((item) => (
          <article key={item.id}>
            <SlidersHorizontal aria-hidden="true" size={18} />
            <span>{item.tradeoff}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HabitsApp() {
  const [habitData, setHabitData] = useState(() => portfolioKernel.getDeveloperHabitsData());

  return (
    <div className="app-view app-view--habits">
      <header className="app-hero">
        <span className="os-label">developer.habits</span>
        <h2>Consistency loops that support internship readiness.</h2>
      </header>
      <div className="habit-grid">
        {habitData.habits.map((habit) => (
          <article key={habit.title}>
            <strong>{habit.streak}</strong>
            <span>{habit.title}</span>
            <small>{habit.category} / {habit.cadence}</small>
            <button type="button" className="inline-action" onClick={() => setHabitData(portfolioKernel.toggleHabitCheckIn(habit.id))}>
              {habit.checkedToday ? "Checked in" : "Check in"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export function WorldApp({ launchWorld }: OsAppComponentProps) {
  const worldRoadmap = portfolioKernel.getWorldRoadmap();

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

function nextTaskStatus(status: "queued" | "active" | "done") {
  if (status === "queued") {
    return "active";
  }

  if (status === "active") {
    return "done";
  }

  return "queued";
}
