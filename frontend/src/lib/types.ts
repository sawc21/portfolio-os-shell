import type { LucideIcon } from "lucide-react";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "case-studies"
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

export type PlannerTask = {
  title: string;
  status: "queued" | "active" | "done";
  app: string;
};

export type BudgetSlice = {
  label: string;
  amount: number;
  color: string;
};

export type HabitItem = {
  title: string;
  streak: number;
  cadence: string;
};
