import type { AppId, ScopeScenarioInput, PlannerTask } from "../../lib/types";
import { getAppById, getApps, getDesktopApps, getLauncherApps } from "./appRegistry";
import { runKernelCommand } from "./commandRegistry";
import { searchPortfolio } from "./searchIndex";
import { mockPortfolioDataProvider } from "../services/mockPortfolioDataProvider";

const provider = mockPortfolioDataProvider;

export const portfolioKernel = {
  getApps,
  getDesktopApps,
  getLauncherApps,
  getAppById,
  search: (query: string) => searchPortfolio(query, provider),
  runCommand: (command: string) => runKernelCommand(command, provider),
  getRecruiterProfile: () => provider.getRecruiterProfile(),
  getPortfolioSignals: () => provider.getPortfolioSignals(),
  getProjects: () => provider.getProjects(),
  getSkillGroups: () => provider.getSkillGroups(),
  getCaseStudies: () => provider.getCaseStudies(),
  getNotes: () => provider.getNotes(),
  getResumeHighlights: () => provider.getResumeHighlights(),
  getOperatingModes: () => provider.getOperatingModes(),
  getWorldRoadmap: () => provider.getWorldRoadmap(),
  getProductivityData: () => ({
    sprint: provider.getSprintPlannerData(),
    scope: provider.getScopeBudgetData(),
    habits: provider.getDeveloperHabitsData()
  }),
  getSprintPlannerData: () => provider.getSprintPlannerData(),
  updateSprintTaskStatus: (id: string, status: PlannerTask["status"]) =>
    provider.updateSprintTaskStatus(id, status),
  getScopeBudgetData: () => provider.getScopeBudgetData(),
  updateScopeScenario: (input: ScopeScenarioInput) => provider.updateScopeScenario(input),
  getDeveloperHabitsData: () => provider.getDeveloperHabitsData(),
  toggleHabitCheckIn: (id: string) => provider.toggleHabitCheckIn(id),
  resetDemoState: () => provider.resetDemoState()
};

export function openApp(id: AppId) {
  return { type: "open-app" as const, appId: id };
}

export type PortfolioKernel = typeof portfolioKernel;
