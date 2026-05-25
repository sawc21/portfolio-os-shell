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
  | "publications"
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

export type AppParamsById = {
  search: { query?: string };
  terminal: { command?: string };
  notes: { noteId?: string; query?: string };
};

export type KnownAppParams = AppParamsById[keyof AppParamsById];
export type AppParamsMap = Partial<Record<AppId, KnownAppParams>>;

type AppParamAction<TType extends "open-app" | "focus-app"> = {
  [TAppId in AppId]: {
    type: TType;
    appId: TAppId;
  } & (TAppId extends keyof AppParamsById ? { params?: AppParamsById[TAppId] } : { params?: never });
}[AppId];

export type ProjectItem = {
  title: string;
  slug: string;
  phase: string;
  role: string;
  summary: string;
  tags: string[];
  branches: string[];
};

export type ProjectSourceType = "github" | "local" | "local-git" | "portfolio-content";

export type CatalogProject = ProjectItem & {
  sourceType: ProjectSourceType;
  repoUrl?: string;
  localPathLabel: string;
  featured: boolean;
  archive: boolean;
  caseStudyPath?: string;
};

export type PublicationItem = {
  title: string;
  category: string;
  sourceContext: string;
  status: string;
  tags: string[];
  citationNote: string;
  url?: string;
};

export type CvProfile = {
  education: string[];
  researchRoles: string[];
  industryExperience: string[];
  technicalStrengths: string[];
  honors: string[];
};

export type PortfolioCatalog = {
  projects: CatalogProject[];
  publications: PublicationItem[];
  cv: CvProfile;
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

export type NoteVisibility = "private" | "public";

export type PortfolioNote = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  visibility: NoteVisibility;
  slug?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
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
  | AppParamAction<"open-app">
  | AppParamAction<"focus-app">
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
