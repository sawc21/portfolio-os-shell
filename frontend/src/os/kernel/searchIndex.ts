import type { AppId, SearchResult, SystemAction } from "../../lib/types";
import { getCatalogProjects, getPublicationItems, portfolioCatalog } from "../../lib/portfolioCatalog";
import type { PortfolioDataProvider } from "../services/portfolioDataProvider";
import { getApps } from "./appRegistry";
import { commandDefinitions } from "./commandRegistry";
import { systemActions } from "./systemActions";

type SearchDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  appId: AppId;
  action: SystemAction;
};

const searchDocumentCache = new WeakMap<PortfolioDataProvider, SearchDocument[]>();

const priorityMatches: Record<string, AppId[]> = {
  "hire sawyer": ["recruiter", "resume", "projects", "contact", "case-studies"],
  internship: ["recruiter", "resume", "projects", "contact"],
  react: ["projects", "skills", "case-studies"],
  typescript: ["projects", "skills", "terminal"],
  systems: ["systems-lab", "workflow-console", "projects", "skills", "recruiter"],
  workflow: ["systems-lab", "workflow-console", "skills"],
  workflows: ["workflow-console", "systems-lab", "terminal"],
  automation: ["systems-lab", "notes", "workflow-console", "planner"],
  notes: ["notes", "systems-lab", "case-studies"],
  notebook: ["notes", "systems-lab", "projects"],
  markdown: ["notes", "case-studies", "projects"],
  postgresql: ["notes", "projects", "skills"],
  "asp.net": ["projects", "resume", "case-studies"],
  testing: ["habits", "projects", "case-studies"],
  "3d": ["world", "projects", "case-studies"],
  files: ["files"],
  explorer: ["files"],
  directory: ["files"],
  planner: ["planner"],
  budget: ["budget"],
  habits: ["habits"],
  terminal: ["terminal"],
  contact: ["contact"],
  resume: ["resume"],
  projects: ["projects"],
  cv: ["publications", "resume", "recruiter"],
  papers: ["publications", "resume", "projects"],
  paper: ["publications", "resume", "projects"],
  publications: ["publications", "resume", "projects"],
  research: ["publications", "projects", "resume"],
  "knowledge graph": ["publications", "projects", "resume", "skills"],
  nasa: ["publications", "case-studies", "projects", "resume", "recruiter"],
  dod: ["publications", "resume", "projects"],
  integration: ["projects", "workflow-console", "systems-lab"],
  inventory: ["projects"],
  extraction: ["projects", "publications"],
  quickbooks: ["projects", "notes", "case-studies", "budget", "skills"]
};

export function searchPortfolio(query: string, provider: PortfolioDataProvider): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  return getSearchDocuments(provider)
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
      action: document.action,
      score
    }));
}

function getSearchDocuments(provider: PortfolioDataProvider) {
  const cached = searchDocumentCache.get(provider);
  if (cached) {
    return cached;
  }

  const documents = buildSearchDocuments(provider);
  searchDocumentCache.set(provider, documents);
  return documents;
}

function buildSearchDocuments(provider: PortfolioDataProvider): SearchDocument[] {
  const appDocs = getApps().map((app) => ({
      id: `app:${app.id}`,
      title: app.title,
      description: app.description,
      category: app.category,
      keywords: [app.id, app.shortTitle, ...app.tags, ...app.commands],
      appId: app.id,
      action: systemActions.openApp(app.id)
  }));

  const projectDocs = provider.getProjects().map((project) => ({
    id: `project:${project.slug}`,
    title: project.title,
    description: project.summary,
    category: "project",
    keywords: [project.phase, project.role, ...project.tags, ...project.branches],
    appId: "projects" as AppId,
    action: systemActions.openApp("projects")
  }));

  const catalogProjectDocs = getCatalogProjects().map((project) => ({
    id: `catalog-project:${project.slug}`,
    title: project.title,
    description: `${project.summary} ${project.localPathLabel}`,
    category: project.featured ? "featured-project" : "project-archive",
    keywords: [
      project.phase,
      project.role,
      project.sourceType,
      project.repoUrl ?? "",
      project.localPathLabel,
      ...project.tags,
      ...project.branches
    ],
    appId: "projects" as AppId,
    action: systemActions.openApp("projects")
  }));

  const skillDocs = provider.getSkillGroups().map((group) => ({
    id: `skill:${group.title}`,
    title: group.title,
    description: group.items.join(", "),
    category: "skill",
    keywords: group.items,
    appId: "skills" as AppId,
    action: systemActions.openApp("skills")
  }));

  const profile = provider.getRecruiterProfile();
  const profileDocs: SearchDocument[] = [
    {
      id: "profile:hire-sawyer",
      title: `Hire ${profile.name}`,
      description: profile.valueProposition,
      category: "recruiter",
      keywords: [
        "hire sawyer",
        "internship",
        ...profile.targetRoles,
        ...profile.skills,
        ...profile.projectHighlights,
        ...profile.workHighlights,
        ...profile.contactLinks.flatMap((link) => [link.label, link.value])
      ],
      appId: "recruiter",
      action: systemActions.openApp("recruiter")
    }
  ];

  const resumeDocs = provider.getResumeHighlights().map((highlight, index) => ({
    id: `resume:${index}`,
    title: "Resume highlight",
    description: highlight,
    category: "resume",
    keywords: ["resume", "experience", "stack", highlight],
    appId: "resume" as AppId,
    action: systemActions.openApp("resume")
  }));

  const caseDocs = provider.getCaseStudies().map((study) => ({
    id: `case:${study.title}`,
    title: study.title,
    description: study.summary,
    category: "case-study",
    keywords: [study.status, ...study.proof],
    appId: "case-studies" as AppId,
    action: systemActions.openApp("case-studies")
  }));

  const publicationDocs = getPublicationItems().map((publication) => ({
    id: `publication:${publication.title}`,
    title: publication.title,
    description: `${publication.sourceContext} - ${publication.citationNote}`,
    category: "publication",
    keywords: [publication.category, publication.sourceContext, publication.status, ...publication.tags],
    appId: "publications" as AppId,
    action: systemActions.openApp("publications")
  }));

  const cvDocs = [
    ...portfolioCatalog.cv.education,
    ...portfolioCatalog.cv.researchRoles,
    ...portfolioCatalog.cv.industryExperience,
    ...portfolioCatalog.cv.technicalStrengths,
    ...portfolioCatalog.cv.honors
  ].map((item, index) => ({
    id: `cv:${index}`,
    title: "CV highlight",
    description: item,
    category: "cv",
    keywords: ["cv", "publications", "research", "education", "honors", item],
    appId: "publications" as AppId,
    action: systemActions.openApp("publications")
  }));

  const commandDocs = commandDefinitions.map((command) => ({
    id: `command:${command.name}`,
    title: command.name,
    description: command.description,
    category: "terminal-command",
    keywords: command.aliases,
    appId: command.targetAppId ?? "terminal",
    action: command.targetAppId ? systemActions.openApp(command.targetAppId) : systemActions.openApp("terminal", { command: "help" })
  }));

  const signalDocs = provider.getPortfolioSignals().map((signal) => ({
    id: `signal:${signal.title}`,
    title: signal.title,
    description: signal.description,
    category: "portfolio-signal",
    keywords: signal.keywords,
    appId: "recruiter" as AppId,
    action: systemActions.openApp("recruiter")
  }));

  const fileDocs = provider.getFileSystemEntries().map((entry) => ({
    id: `file:${entry.id}`,
    title: entry.name,
    description: `${entry.directory} - ${entry.description}`,
    category: `file-${entry.kind}`,
    keywords: [entry.directory, entry.sourcePath ?? "", entry.href ?? "", ...entry.tags],
    appId: entry.appId ?? "files" as AppId,
    action: entry.action ?? (entry.appId ? systemActions.openApp(entry.appId) : systemActions.openApp("files"))
  }));

  const contactDocs = profile.contactLinks.map((link) => ({
    id: `contact:${link.label}`,
    title: `${link.label}: ${link.value}`,
    description: `Contact path for ${profile.name}.`,
    category: "contact",
    keywords: ["contact", "email", "recruiter", link.label, link.value],
    appId: "contact" as AppId,
    action: systemActions.openApp("contact")
  }));

  return [
    ...appDocs,
    ...catalogProjectDocs,
    ...projectDocs,
    ...skillDocs,
    ...profileDocs,
    ...resumeDocs,
    ...caseDocs,
    ...publicationDocs,
    ...cvDocs,
    ...commandDocs,
    ...signalDocs,
    ...fileDocs,
    ...contactDocs
  ];
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

  if (document.id === "profile:hire-sawyer" && score > 0) {
    score += 24;
  }

  if (normalizedQuery === "integration" && document.id === "catalog-project:quickbooks-toolkit") {
    score += 24;
  }

  return score;
}
