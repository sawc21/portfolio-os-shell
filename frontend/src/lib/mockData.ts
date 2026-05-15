import type { BudgetSlice, HabitItem, PlannerTask, ProjectItem } from "./types";

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

export const operatingModes = [
  "Product designer: shape identity, flows, copy, and visual hierarchy.",
  "C# developer: build durable server-rendered features with tests.",
  "Infrastructure learner: use self-hosting as a real operating context.",
  "Technical writer: document decisions so the work is inspectable."
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
