import type { AppId, SearchResult } from "../../lib/types";
import type { PortfolioDataProvider } from "../services/portfolioDataProvider";
import { getApps } from "./appRegistry";
import { commandDefinitions } from "./commandRegistry";

type SearchDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  appId: AppId;
};

const priorityMatches: Record<string, AppId[]> = {
  "hire sawyer": ["recruiter", "resume", "projects", "contact", "case-studies"],
  internship: ["recruiter", "resume", "projects", "contact"],
  react: ["projects", "skills", "case-studies"],
  typescript: ["projects", "skills", "terminal"],
  "asp.net": ["projects", "resume", "case-studies"],
  testing: ["habits", "projects", "case-studies"],
  "3d": ["world", "projects", "case-studies"],
  planner: ["planner"],
  budget: ["budget"],
  habits: ["habits"],
  terminal: ["terminal"],
  contact: ["contact"],
  resume: ["resume"],
  projects: ["projects"]
};

export function searchPortfolio(query: string, provider: PortfolioDataProvider): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return buildSearchDocuments(provider)
    .map((document) => ({ document, score: scoreDocument(document, terms, normalizedQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
    .slice(0, 8)
    .map(({ document, score }) => ({
      id: document.id,
      title: document.title,
      description: document.description,
      category: document.category,
      keywords: document.keywords,
      action: { type: "open-app", appId: document.appId },
      score
    }));
}

function buildSearchDocuments(provider: PortfolioDataProvider): SearchDocument[] {
  const appDocs = getApps().map((app) => ({
    id: `app:${app.id}`,
    title: app.title,
    description: app.description,
    category: app.category,
    keywords: [app.id, app.shortTitle, ...app.tags, ...app.commands],
    appId: app.id
  }));

  const projectDocs = provider.getProjects().map((project) => ({
    id: `project:${project.slug}`,
    title: project.title,
    description: project.summary,
    category: "project",
    keywords: [project.phase, project.role, ...project.tags, ...project.branches],
    appId: "projects" as AppId
  }));

  const skillDocs = provider.getSkillGroups().map((group) => ({
    id: `skill:${group.title}`,
    title: group.title,
    description: group.items.join(", "),
    category: "skill",
    keywords: group.items,
    appId: "skills" as AppId
  }));

  const profile = provider.getRecruiterProfile();
  const profileDocs: SearchDocument[] = [
    {
      id: "profile:hire-sawyer",
      title: `Hire ${profile.name}`,
      description: profile.valueProposition,
      category: "recruiter",
      keywords: ["hire sawyer", "internship", ...profile.targetRoles, ...profile.skills, ...profile.projectHighlights],
      appId: "recruiter"
    }
  ];

  const resumeDocs = provider.getResumeHighlights().map((highlight, index) => ({
    id: `resume:${index}`,
    title: "Resume highlight",
    description: highlight,
    category: "resume",
    keywords: ["resume", "experience", "stack", highlight],
    appId: "resume" as AppId
  }));

  const caseDocs = provider.getCaseStudies().map((study) => ({
    id: `case:${study.title}`,
    title: study.title,
    description: study.summary,
    category: "case-study",
    keywords: [study.status, ...study.proof],
    appId: "case-studies" as AppId
  }));

  const commandDocs = commandDefinitions.map((command) => ({
    id: `command:${command.name}`,
    title: command.name,
    description: command.description,
    category: "terminal-command",
    keywords: command.aliases,
    appId: command.targetAppId ?? "terminal"
  }));

  const signalDocs = provider.getPortfolioSignals().map((signal) => ({
    id: `signal:${signal.title}`,
    title: signal.title,
    description: signal.description,
    category: "portfolio-signal",
    keywords: signal.keywords,
    appId: "recruiter" as AppId
  }));

  return [...appDocs, ...projectDocs, ...skillDocs, ...profileDocs, ...resumeDocs, ...caseDocs, ...commandDocs, ...signalDocs];
}

function scoreDocument(document: SearchDocument, terms: string[], normalizedQuery: string) {
  const haystack = [
    document.title,
    document.description,
    document.category,
    ...document.keywords
  ].join(" ").toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (document.title.toLowerCase().includes(term)) {
      score += 8;
    }
    if (haystack.includes(term)) {
      score += 3;
    }
  }

  if (haystack.includes(normalizedQuery)) {
    score += 10;
  }

  const priority = priorityMatches[normalizedQuery];
  if (priority) {
    const rank = priority.indexOf(document.appId);
    if (rank >= 0) {
      score += 80 - rank * 8;
    }
  }

  return score;
}
