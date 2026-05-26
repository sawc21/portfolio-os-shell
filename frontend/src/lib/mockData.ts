import type {
  CaseStudyItem,
  FileSystemEntry,
  HabitItem,
  NoteItem,
  PlannerTask,
  ProjectItem,
  ScopeBudgetData,
  SkillGroup
} from "./types";
import { getCatalogProjectItems } from "./portfolioCatalog";

export const projects: ProjectItem[] = getCatalogProjectItems();

export const resumeHighlights = [
  "Computer Science undergraduate with a 3.8 GPA and DoD-funded CTI knowledge-graph research.",
  "ASP.NET Core/C# backend web applications, REST APIs, CRUD services, and PostgreSQL schemas at Intellivega.",
  "LLM-assisted extraction, semantic chunking, consensus filtering, and validation/repair for CTI triples.",
  "Unreal Engine 5 and C++ NASA Artemis Gateway simulation research through NASA/Barrios and The DataMine."
];

export const operatingModes = [
  "Backend engineer: ASP.NET Core, C#, REST APIs, PostgreSQL schema design, indexing, joins, and normalization.",
  "Cybersecurity researcher: CTI extraction workflows, knowledge graph construction, and triple validation.",
  "AI systems builder: LLM-assisted information extraction with safeguards against hallucinated triples.",
  "Simulation developer: Unreal Engine 5 and C++ systems for Artemis Gateway visualization."
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend systems",
    items: ["ASP.NET Core", "C#", "REST APIs", "CRUD services", "PostgreSQL", "SQL optimization"]
  },
  {
    title: "AI and cybersecurity research",
    items: ["CTI extraction", "Knowledge graphs", "Triple modeling", "LLM-assisted extraction", "Validation and repair"]
  },
  {
    title: "Application and simulation tools",
    items: ["Python", "C++", "JavaScript", "React", "TypeScript", "Unreal Engine 5"]
  },
  {
    title: "Delivery habits",
    items: ["Git", "Agile", "Data structures", "Algorithmic problem-solving", "Testing", "Documentation"]
  }
];

export const caseStudies: CaseStudyItem[] = [
  {
    title: "Portfolio OS architecture",
    status: "active case study",
    summary:
      "A Razor Pages site keeps stable public content routes while a React/TypeScript desktop owns the main portfolio experience.",
    proof: ["Hybrid ASP.NET + Vite build", "App registry model", "Window state and terminal commands"]
  },
  {
    title: "Markdown content platform",
    status: "existing foundation",
    summary:
      "Project and blog routes remain server-rendered for direct links, SEO, and tests while their content is mirrored into OS apps.",
    proof: ["Public route tests", "RSS feed", "Sitemap", "Markdown-backed content"]
  },
  {
    title: "Desktop-to-world roadmap",
    status: "future branch",
    summary:
      "The Launch World flow starts as a CSS spatial prototype and can later graduate to React Three Fiber and Drei.",
    proof: ["Boot overlay", "Reduced-motion path", "Small scene scope", "Clickable stations"]
  }
];

export const notes: NoteItem[] = [
  {
    title: "Starting the Portfolio",
    date: "2026.01.06",
    summary: "Why the first version focused on a durable ASP.NET content foundation before the OS interface.",
    slug: "starting-the-portfolio"
  }
];

export const fileSystemEntries: FileSystemEntry[] = [
  {
    id: "desktop-recruiter",
    name: "Recruiter Quick View.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Hiring-focused dashboard for Sawyer Cawthon.",
    tags: ["hire", "recruiter", "internship"],
    appId: "recruiter"
  },
  {
    id: "desktop-search",
    name: "Sawyer Search.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Internal search across apps, skills, projects, and commands.",
    tags: ["search", "kernel"],
    appId: "search"
  },
  {
    id: "desktop-terminal",
    name: "Terminal.exe",
    kind: "app",
    directory: "C:\\PortfolioOS\\System32",
    description: "Command-line interface for opening apps and searching the portfolio.",
    tags: ["terminal", "commands"],
    appId: "terminal"
  },
  {
    id: "desktop-resume",
    name: "Resume.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Resume app with stack, operating modes, and interview proof.",
    tags: ["resume", "experience", "stack"],
    appId: "resume"
  },
  {
    id: "desktop-projects",
    name: "Projects.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Project proof and case-study branches.",
    tags: ["projects", "proof", "case studies"],
    appId: "projects"
  },
  {
    id: "desktop-cases",
    name: "Case Studies.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Interview-ready architecture decision notes.",
    tags: ["case studies", "architecture", "interview"],
    appId: "case-studies"
  },
  {
    id: "desktop-publications",
    name: "Publications & CV.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Research publications, CV sections, education, honors, and paper status.",
    tags: ["publications", "papers", "research", "cv", "nasa", "dod"],
    appId: "publications"
  },
  {
    id: "desktop-project-notes",
    name: "Project Notes.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Local project notebook with markdown drafts, tags, favorites, and public/private note state.",
    tags: ["project notes", "notebook", "markdown", "workflows", "postgresql", "quickbooks"],
    appId: "notes"
  },
  {
    id: "desktop-skills",
    name: "Skills.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Grouped backend, AI/cybersecurity research, simulation, and delivery strengths.",
    tags: ["skills", "c#", "python", "postgresql", "knowledge graphs"],
    appId: "skills"
  },
  {
    id: "desktop-contact",
    name: "Contact.app",
    kind: "app",
    directory: "C:\\PortfolioOS\\Desktop",
    description: "Contact paths for recruiters and collaborators.",
    tags: ["contact", "email", "links"],
    appId: "contact"
  },
  {
    id: "system-commands",
    name: "Commands.txt",
    kind: "source",
    directory: "C:\\PortfolioOS\\System",
    description: "Opens Terminal with the help command queued.",
    tags: ["commands", "terminal", "help"],
    action: { type: "open-app", appId: "terminal", params: { command: "help" } }
  },
  {
    id: "system-search",
    name: "Search.lnk",
    kind: "app",
    directory: "C:\\PortfolioOS\\System",
    description: "Opens Sawyer Search.",
    tags: ["search", "find", "kernel"],
    action: { type: "open-search", query: "" }
  },
  {
    id: "routes-projects",
    name: "Projects.url",
    kind: "route",
    directory: "C:\\PortfolioOS\\PublicRoutes",
    description: "Server-rendered projects fallback route.",
    tags: ["projects", "asp.net", "route"],
    href: "/projects"
  },
  {
    id: "routes-resume",
    name: "Resume.url",
    kind: "route",
    directory: "C:\\PortfolioOS\\PublicRoutes",
    description: "Server-rendered resume fallback route.",
    tags: ["resume", "route"],
    href: "/resume"
  },
  {
    id: "routes-cv",
    name: "CV.url",
    kind: "route",
    directory: "C:\\PortfolioOS\\PublicRoutes",
    description: "Server-rendered CV and publications route.",
    tags: ["cv", "publications", "papers", "research", "route"],
    href: "/cv"
  },
  {
    id: "routes-contact",
    name: "Contact.url",
    kind: "route",
    directory: "C:\\PortfolioOS\\PublicRoutes",
    description: "Server-rendered contact fallback route.",
    tags: ["contact", "route"],
    href: "/contact"
  },
  {
    id: "routes-blog",
    name: "Blog.url",
    kind: "route",
    directory: "C:\\PortfolioOS\\PublicRoutes",
    description: "Markdown-backed blog and notes route.",
    tags: ["blog", "markdown", "route"],
    href: "/blog"
  },
  {
    id: "source-kernel",
    name: "kernel.ts",
    kind: "source",
    directory: "C:\\PortfolioOS\\Source\\frontend\\src\\os\\kernel",
    description: "Public facade that connects apps, commands, search, profile, and data providers.",
    tags: ["typescript", "kernel", "architecture"],
    sourcePath: "frontend/src/os/kernel/kernel.ts"
  },
  {
    id: "source-search",
    name: "searchIndex.ts",
    kind: "source",
    directory: "C:\\PortfolioOS\\Source\\frontend\\src\\os\\kernel",
    description: "Fake internal search engine and ranking rules.",
    tags: ["typescript", "search"],
    sourcePath: "frontend/src/os/kernel/searchIndex.ts"
  },
  {
    id: "source-provider",
    name: "portfolioDataProvider.ts",
    kind: "source",
    directory: "C:\\PortfolioOS\\Source\\frontend\\src\\os\\services",
    description: "API-ready provider interface for replacing mock data later.",
    tags: ["api-ready", "interface"],
    sourcePath: "frontend/src/os/services/portfolioDataProvider.ts"
  },
  {
    id: "source-apps",
    name: "PortfolioApps.tsx",
    kind: "source",
    directory: "C:\\PortfolioOS\\Source\\frontend\\src\\components\\os\\apps",
    description: "React app views rendered inside draggable OS windows.",
    tags: ["react", "tsx", "apps"],
    sourcePath: "frontend/src/components/os/apps/PortfolioApps.tsx"
  }
];

export const plannerTasks: PlannerTask[] = [
  {
    id: "kernel-search",
    title: "Build Portfolio Kernel and Sawyer Search",
    status: "active",
    area: "Frontend architecture",
    tags: ["Frontend", "TypeScript", "Search"]
  },
  {
    id: "recruiter-flow",
    title: "Connect recruiter CTAs across Resume, Contact, and Search",
    status: "queued",
    area: "Career",
    tags: ["Career", "UX", "Portfolio"]
  },
  {
    id: "route-tests",
    title: "Keep public ASP.NET routes and fallback links tested",
    status: "done",
    area: "Backend",
    tags: ["Backend", "Testing", "ASP.NET"]
  },
  {
    id: "world-prototype",
    title: "Prototype compact 3D command room",
    status: "queued",
    area: "Creative tech",
    tags: ["3D", "Design", "Frontend"]
  },
  {
    id: "interview-polish",
    title: "Polish portfolio case-study copy for internship reviewers",
    status: "active",
    area: "Interview prep",
    tags: ["Career", "Documentation", "Design"]
  }
];

export const sprintPlannerData = {
  currentSprint: "Portfolio Kernel Sprint",
  sprintGoal:
    "Make the OS feel connected, searchable, and clearly aimed at software internship conversion.",
  tasks: plannerTasks,
  roadmap: [
    "Kernel/search architecture",
    "Recruiter Quick View",
    "Functional evidence apps",
    "Browser interaction tests",
    "React Three Fiber world prototype"
  ]
};

export const scopeBudgetData: ScopeBudgetData = {
  scenario: {
    polishBias: 62,
    threeDBias: 28
  },
  items: [
    {
      id: "kernel",
      label: "Kernel + search",
      value: 36,
      unit: "hours",
      risk: "medium",
      recruiterValue: 94,
      color: "#55f0c2",
      tradeoff: "Adds architecture credibility and makes every app feel connected."
    },
    {
      id: "polish",
      label: "Interaction polish",
      value: 24,
      unit: "hours",
      risk: "low",
      recruiterValue: 88,
      color: "#8be7ff",
      tradeoff: "Improves first impression without increasing technical scope too much."
    },
    {
      id: "content",
      label: "Case-study content",
      value: 18,
      unit: "hours",
      risk: "low",
      recruiterValue: 84,
      color: "#ffd166",
      tradeoff: "Turns the project into interview evidence instead of a visual gimmick."
    },
    {
      id: "world",
      label: "3D prototype",
      value: 16,
      unit: "hours",
      risk: "high",
      recruiterValue: 76,
      color: "#ff8fab",
      tradeoff: "Memorable, but only worth expanding after the OS shell is stable."
    }
  ]
};

export const habits: HabitItem[] = [
  {
    id: "daily-coding",
    title: "Daily coding",
    streak: 11,
    cadence: "daily",
    category: "coding",
    checkedToday: true
  },
  {
    id: "docs",
    title: "Documentation",
    streak: 7,
    cadence: "weekly",
    category: "documentation",
    checkedToday: false
  },
  {
    id: "commits",
    title: "Git commits",
    streak: 9,
    cadence: "weekly",
    category: "git",
    checkedToday: true
  },
  {
    id: "dsa",
    title: "Data structures practice",
    streak: 5,
    cadence: "weekly",
    category: "practice",
    checkedToday: false
  },
  {
    id: "tests",
    title: "Testing",
    streak: 8,
    cadence: "per feature",
    category: "testing",
    checkedToday: true
  },
  {
    id: "portfolio-polish",
    title: "Portfolio polish",
    streak: 6,
    cadence: "weekly",
    category: "polish",
    checkedToday: false
  }
];

export const developerHabitsData = { habits };

export const bootLines = [
  "Initializing portfolio world...",
  "Loading project environment...",
  "Mapping apps to stations...",
  "Opening 3D interface..."
];

export const worldRoadmap = [
  "Replace the CSS prototype with React Three Fiber and Drei.",
  "Map desktop icons into clickable stations: projects gallery, resume terminal, contact tower.",
  "Animate a desktop split/fold transition into a compact floating island.",
  "Keep the scene small, readable, and performance-friendly for internship reviewers."
];
