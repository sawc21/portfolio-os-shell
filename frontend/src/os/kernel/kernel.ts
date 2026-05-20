import type { AppId, FileSystemEntry, ScopeScenarioInput, PlannerTask } from "../../lib/types";
import { getAppById, getApps, getDesktopApps, getLauncherApps } from "./appRegistry";
import { runKernelCommand } from "./commandRegistry";
import { searchPortfolio } from "./searchIndex";
import { mockPortfolioDataProvider } from "../services/mockPortfolioDataProvider";
import { describeSystemAction, systemActions } from "./systemActions";

const provider = mockPortfolioDataProvider;

export const portfolioKernel = {
  actions: systemActions,
  getApps,
  getDesktopApps,
  getLauncherApps,
  getAppById,
  search: (query: string) => searchPortfolio(query, provider),
  runCommand: (command: string) => runKernelCommand(command, provider),
  describeAction: describeSystemAction,
  getRecruiterProfile: () => provider.getRecruiterProfile(),
  getPortfolioSignals: () => provider.getPortfolioSignals(),
  getProjects: () => provider.getProjects(),
  getSkillGroups: () => provider.getSkillGroups(),
  getCaseStudies: () => provider.getCaseStudies(),
  getNotes: () => provider.getNotes(),
  getFileSystemEntries: () => provider.getFileSystemEntries(),
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
  resetDemoState: () => provider.resetDemoState(),
  getFileSystemEntryAction: (entry: FileSystemEntry) => {
    if (entry.action) {
      return entry.action;
    }

    if (entry.appId) {
      return systemActions.openApp(entry.appId);
    }

    if (entry.href) {
      return systemActions.openUrl(entry.href);
    }

    if (entry.sourcePath) {
      return systemActions.copyText(entry.sourcePath, entry.name);
    }

    return systemActions.print([entry.name, entry.description]);
  }
};

export function openApp(id: AppId) {
  return systemActions.openApp(id);
}

export type PortfolioKernel = typeof portfolioKernel;
