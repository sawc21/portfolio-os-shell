import type { LucideIcon } from "lucide-react";

export type AppId =
  | "projects"
  | "resume"
  | "terminal"
  | "contact"
  | "planner"
  | "budget"
  | "habits";

export type AppCategory = "portfolio" | "productivity" | "system";

export type AppDefinition = {
  id: AppId;
  title: string;
  shortTitle: string;
  description: string;
  category: AppCategory;
  icon: LucideIcon;
  accent: string;
  defaultSize: {
    width: number;
    height: number;
  };
  defaultPosition: {
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
