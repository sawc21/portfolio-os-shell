import {
  caseStudies,
  developerHabitsData,
  fileSystemEntries,
  notes,
  operatingModes,
  projects,
  resumeHighlights,
  scopeBudgetData,
  skillGroups,
  sprintPlannerData,
  worldRoadmap
} from "../../lib/mockData";
import type {
  DeveloperHabitsData,
  HabitItem,
  PlannerTask,
  ScopeBudgetData,
  ScopeScenarioInput,
  SprintPlannerData
} from "../../lib/types";
import { portfolioSignals } from "../kernel/portfolioSignals";
import { recruiterProfile } from "../kernel/recruiterProfile";
import type { PortfolioDataProvider } from "./portfolioDataProvider";
import { readLocalState, removeLocalState, writeLocalState } from "./localPortfolioState";

const sprintKey = "portfolio-os:sprint-planner:v1";
const scopeKey = "portfolio-os:scope-budget:v1";
const habitsKey = "portfolio-os:developer-habits:v1";

function getSprintPlannerData(): SprintPlannerData {
  return readLocalState(sprintKey, sprintPlannerData);
}

function getScopeBudgetData(): ScopeBudgetData {
  return readLocalState(scopeKey, scopeBudgetData);
}

function getDeveloperHabitsData(): DeveloperHabitsData {
  return readLocalState(habitsKey, developerHabitsData);
}

export const mockPortfolioDataProvider: PortfolioDataProvider = {
  getRecruiterProfile: () => recruiterProfile,
  getPortfolioSignals: () => portfolioSignals,
  getProjects: () => projects,
  getSkillGroups: () => skillGroups,
  getCaseStudies: () => caseStudies,
  getNotes: () => notes,
  getFileSystemEntries: () => fileSystemEntries,
  getResumeHighlights: () => resumeHighlights,
  getOperatingModes: () => operatingModes,
  getWorldRoadmap: () => worldRoadmap,
  getSprintPlannerData,
  updateSprintTaskStatus(id: string, status: PlannerTask["status"]) {
    const data = getSprintPlannerData();
    const next = {
      ...data,
      tasks: data.tasks.map((task) => (task.id === id ? { ...task, status } : task))
    };
    writeLocalState(sprintKey, next);
    return next;
  },
  getScopeBudgetData,
  updateScopeScenario(input: ScopeScenarioInput) {
    const next = { ...getScopeBudgetData(), scenario: input };
    writeLocalState(scopeKey, next);
    return next;
  },
  getDeveloperHabitsData,
  toggleHabitCheckIn(id: string) {
    const data = getDeveloperHabitsData();
    const next = {
      habits: data.habits.map((habit: HabitItem) =>
        habit.id === id ? { ...habit, checkedToday: !habit.checkedToday } : habit
      )
    };
    writeLocalState(habitsKey, next);
    return next;
  },
  resetDemoState() {
    removeLocalState(sprintKey);
    removeLocalState(scopeKey);
    removeLocalState(habitsKey);
  }
};
