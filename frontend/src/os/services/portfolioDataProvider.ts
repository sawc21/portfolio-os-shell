import type {
  CaseStudyItem,
  DeveloperHabitsData,
  FileSystemEntry,
  HabitItem,
  NoteItem,
  PlannerTask,
  PortfolioSignal,
  ProjectItem,
  RecruiterProfile,
  ScopeBudgetData,
  ScopeScenarioInput,
  SkillGroup,
  SprintPlannerData
} from "../../lib/types";

export type PortfolioDataProvider = {
  getRecruiterProfile(): RecruiterProfile;
  getPortfolioSignals(): PortfolioSignal[];
  getProjects(): ProjectItem[];
  getSkillGroups(): SkillGroup[];
  getCaseStudies(): CaseStudyItem[];
  getNotes(): NoteItem[];
  getFileSystemEntries(): FileSystemEntry[];
  getResumeHighlights(): string[];
  getOperatingModes(): string[];
  getWorldRoadmap(): string[];
  getSprintPlannerData(): SprintPlannerData;
  updateSprintTaskStatus(id: string, status: PlannerTask["status"]): SprintPlannerData;
  getScopeBudgetData(): ScopeBudgetData;
  updateScopeScenario(input: ScopeScenarioInput): ScopeBudgetData;
  getDeveloperHabitsData(): DeveloperHabitsData;
  toggleHabitCheckIn(id: string): DeveloperHabitsData;
  resetDemoState(): void;
};
