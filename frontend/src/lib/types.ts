import type { LucideIcon } from "lucide-react";

export type AppId =
  | "about"
  | "recruiter"
  | "search"
  | "files"
  | "projects"
  | "skills"
  | "case-studies"
  | "ai-lab"
  | "agent-console"
  | "notes"
  | "resume"
  | "terminal"
  | "contact"
  | "planner"
  | "budget"
  | "habits"
  | "world";

export type AppCategory = "portfolio" | "content" | "productivity" | "system";

export type AppDefinition = {
  id: AppId;
  title: string;
  shortTitle: string;
  description: string;
  category: AppCategory;
  icon: LucideIcon;
  accent: string;
  tags: string[];
  desktop: boolean;
  launcher: boolean;
  commands: string[];
  defaultWindow: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
};

export type WindowInstance = {
  appId: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

export type DesktopIconPosition = {
  x: number;
  y: number;
};

export type ProjectItem = {
  title: string;
  slug: string;
  phase: string;
  role: string;
  summary: string;
  tags: string[];
  branches: string[];
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export type RecruiterProfile = {
  name: string;
  targetRoles: string[];
  shortPitch: string;
  valueProposition: string;
  skills: string[];
  projectHighlights: string[];
  workHighlights: string[];
  contactLinks: ContactLink[];
  resumeLink: string;
};

export type PortfolioSignal = {
  title: string;
  description: string;
  keywords: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type CaseStudyItem = {
  title: string;
  status: string;
  summary: string;
  proof: string[];
};

export type NoteItem = {
  title: string;
  date: string;
  summary: string;
  slug: string;
};

export type FileSystemEntry = {
  id: string;
  name: string;
  kind: "folder" | "app" | "route" | "source";
  directory: string;
  description: string;
  tags: string[];
  appId?: AppId;
  href?: string;
  sourcePath?: string;
  action?: SystemAction;
};

export type PlannerTask = {
  id: string;
  title: string;
  status: "queued" | "active" | "done";
  area: string;
  tags: string[];
};

export type SprintPlannerData = {
  currentSprint: string;
  sprintGoal: string;
  tasks: PlannerTask[];
  roadmap: string[];
};

export type ScopeBudgetItem = {
  id: string;
  label: string;
  value: number;
  unit: string;
  risk: "low" | "medium" | "high";
  recruiterValue: number;
  color: string;
  tradeoff: string;
};

export type ScopeScenarioInput = {
  polishBias: number;
  threeDBias: number;
};

export type ScopeBudgetData = {
  items: ScopeBudgetItem[];
  scenario: ScopeScenarioInput;
};

export type HabitItem = {
  id: string;
  title: string;
  streak: number;
  cadence: string;
  category: "coding" | "documentation" | "git" | "practice" | "testing" | "polish";
  checkedToday: boolean;
};

export type DeveloperHabitsData = {
  habits: HabitItem[];
};

export type SystemAction =
  | { type: "open-app"; appId: AppId; params?: unknown }
  | { type: "focus-app"; appId: AppId; params?: unknown }
  | { type: "open-search"; query: string }
  | { type: "launch-world" }
  | { type: "reset-os" }
  | { type: "clear" }
  | { type: "print"; lines: string[] }
  | { type: "open-url"; href: string }
  | { type: "copy-text"; text: string; label?: string }
  | { type: "download-url"; href: string; filename?: string };

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  action: SystemAction;
  score: number;
};
