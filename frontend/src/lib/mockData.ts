import type {
  BudgetSlice,
  CaseStudyItem,
  HabitItem,
  NoteItem,
  PlannerTask,
  ProjectItem,
  SkillGroup
} from "./types";

export const projects: ProjectItem[] = [
  {
    title: "Portfolio Platform",
    slug: "portfolio-platform",
    phase: "prototype",
    role: "Product design + ASP.NET",
    summary:
      "A database-free ASP.NET Core portfolio built around Razor Pages, Markdown content, SEO basics, RSS, and sitemap generation.",
    tags: ["ASP.NET", "C#", "Razor Pages", "Markdown"],
    branches: ["identity system", "content engine", "deployment path"]
  },
  {
    title: "Homelab Roadmap",
    slug: "homelab-roadmap",
    phase: "concept",
    role: "Infrastructure strategy",
    summary:
      "A companion track for Raspberry Pi, VPS, Cloudflare Tunnel, and private service experiments without risking portfolio uptime.",
    tags: ["Self-hosting", "Cloudflare", "VPS"],
    branches: ["VPS edge", "Cloudflare tunnel", "Raspberry Pi services"]
  }
];

export const resumeHighlights = [
  "ASP.NET Core, Razor Pages, C#, and server-rendered web applications.",
  "Content-backed websites with clear routing, SEO, RSS, and deployment hygiene.",
  "Self-hosting experiments with VPS, Raspberry Pi, Cloudflare DNS, and tunnels.",
  "Accessibility, responsive UI, testing, and release flow fundamentals."
];

export const aboutProfile = {
  headline: "A full-stack developer building portfolio software like a product.",
  summary:
    "This operating system turns the portfolio itself into a working interface: apps, windows, commands, demo data, and a roadmap toward a small 3D world. It is built to show product thinking, frontend architecture, ASP.NET ownership, and disciplined iteration.",
  signals: ["Software developer internships", "ASP.NET + React", "Creative tools", "Readable architecture"]
};

export const operatingModes = [
  "Product designer: shape identity, flows, copy, and visual hierarchy.",
  "C# developer: build durable server-rendered features with tests.",
  "Infrastructure learner: use self-hosting as a real operating context.",
  "Technical writer: document decisions so the work is inspectable."
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend systems",
    items: ["React", "TypeScript", "Vite", "Motion", "Responsive UI", "Accessibility"]
  },
  {
    title: "Backend foundation",
    items: ["ASP.NET Core", "Razor Pages", "C#", "xUnit", "RSS", "Sitemap generation"]
  },
  {
    title: "Creative technology",
    items: ["Interactive UI", "Window managers", "Animation sequencing", "3D roadmap", "Design systems"]
  },
  {
    title: "Delivery habits",
    items: ["Feature branches", "Test checkpoints", "Mock data first", "Documentation", "Case-study writing"]
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

export const plannerTasks: PlannerTask[] = [
  { title: "Ship OS shell MVP", status: "active", app: "Desktop" },
  { title: "Replace placeholder contact links", status: "queued", app: "Contact" },
  { title: "Write portfolio case study", status: "queued", app: "Projects" },
  { title: "Prototype 3D command room", status: "queued", app: "World" },
  { title: "Keep public routes tested", status: "done", app: "ASP.NET" }
];

export const budgetSlices: BudgetSlice[] = [
  { label: "Hosting", amount: 18, color: "#55f0c2" },
  { label: "Domains", amount: 14, color: "#8be7ff" },
  { label: "Learning", amount: 32, color: "#ffd166" },
  { label: "Tools", amount: 21, color: "#ff8fab" }
];

export const habits: HabitItem[] = [
  { title: "Build log", streak: 6, cadence: "weekly" },
  { title: "Ship small demo", streak: 4, cadence: "biweekly" },
  { title: "Refactor notes", streak: 9, cadence: "weekly" },
  { title: "Interview prep", streak: 5, cadence: "weekly" }
];

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
