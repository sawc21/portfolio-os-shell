import type { ComponentType } from "react";
import type { AppId } from "../../../lib/types";
import type { OsAppComponentProps } from "./PortfolioApps";
import {
  AboutApp,
  WorkflowConsoleApp,
  SystemsLabApp,
  BudgetApp,
  CaseStudiesApp,
  ContactApp,
  FileExplorerApp,
  HabitsApp,
  NotesApp,
  PlannerApp,
  ProjectsApp,
  PublicationsApp,
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
  "systems-lab": SystemsLabApp,
  "workflow-console": WorkflowConsoleApp,
  publications: PublicationsApp,
  notes: NotesApp,
  resume: ResumeApp,
  terminal: TerminalApp,
  contact: ContactApp,
  planner: PlannerApp,
  budget: BudgetApp,
  habits: HabitsApp,
  world: WorldApp
};
