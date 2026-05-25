import type { ComponentType } from "react";
import type { AppId } from "../../../lib/types";
import type { OsAppComponentProps } from "./PortfolioApps";
import {
  AboutApp,
  AgentConsoleApp,
  AiLabApp,
  BudgetApp,
  CaseStudiesApp,
  ContactApp,
  FileExplorerApp,
  HabitsApp,
  NotesApp,
  PlannerApp,
  ProjectsApp,
  RecruiterApp,
  ResumeApp,
  SearchApp,
  SkillsApp,
  TerminalApp,
  WorldApp
} from "./PortfolioApps";

export const appComponents: Record<AppId, ComponentType<OsAppComponentProps>> = {
  about: AboutApp,
  recruiter: RecruiterApp,
  search: SearchApp,
  files: FileExplorerApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  "case-studies": CaseStudiesApp,
  "ai-lab": AiLabApp,
  "agent-console": AgentConsoleApp,
  notes: NotesApp,
  resume: ResumeApp,
  terminal: TerminalApp,
  contact: ContactApp,
  planner: PlannerApp,
  budget: BudgetApp,
  habits: HabitsApp,
  world: WorldApp
};
