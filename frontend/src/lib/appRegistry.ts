import {
  BadgeInfo,
  CalendarCheck,
  FileText,
  Flame,
  FolderKanban,
  GalleryVerticalEnd,
  Lightbulb,
  Mail,
  Orbit,
  PenLine,
  TerminalSquare,
  WalletCards
} from "lucide-react";
import type { AppDefinition } from "./types";

export const appRegistry: AppDefinition[] = [
  {
    id: "about",
    title: "About Me",
    shortTitle: "About",
    description: "A compact profile of the builder behind the OS.",
    category: "portfolio",
    icon: BadgeInfo,
    accent: "#70d7b2",
    tags: ["profile", "story", "internship"],
    desktop: true,
    launcher: true,
    commands: ["about", "whoami"],
    defaultWindow: { width: 590, height: 430, x: 64, y: 68 }
  },
  {
    id: "projects",
    title: "Projects",
    shortTitle: "Projects",
    description: "Case studies, branches, and technical proof.",
    category: "portfolio",
    icon: FolderKanban,
    accent: "#55f0c2",
    tags: ["case studies", "full stack", "proof"],
    desktop: true,
    launcher: true,
    commands: ["projects", "work"],
    defaultWindow: { width: 720, height: 500, x: 92, y: 86 }
  },
  {
    id: "skills",
    title: "Skills",
    shortTitle: "Skills",
    description: "Grouped frontend, backend, tooling, and design strengths.",
    category: "portfolio",
    icon: Lightbulb,
    accent: "#ffd166",
    tags: ["stack", "tools", "strengths"],
    desktop: true,
    launcher: true,
    commands: ["skills", "stack"],
    defaultWindow: { width: 620, height: 460, x: 148, y: 112 }
  },
  {
    id: "case-studies",
    title: "Case Studies",
    shortTitle: "Cases",
    description: "Interview-ready explanations of architecture decisions.",
    category: "portfolio",
    icon: GalleryVerticalEnd,
    accent: "#8be7ff",
    tags: ["architecture", "story", "recruiters"],
    desktop: true,
    launcher: true,
    commands: ["case-studies", "cases"],
    defaultWindow: { width: 700, height: 500, x: 176, y: 92 }
  },
  {
    id: "notes",
    title: "Blog / Notes",
    shortTitle: "Notes",
    description: "Build notes and technical writing inside the desktop.",
    category: "content",
    icon: PenLine,
    accent: "#c6a7ff",
    tags: ["blog", "notes", "writing"],
    desktop: true,
    launcher: true,
    commands: ["notes", "blog"],
    defaultWindow: { width: 620, height: 430, x: 226, y: 128 }
  },
  {
    id: "resume",
    title: "Resume",
    shortTitle: "Resume",
    description: "Stack depth, operating modes, and proof to add.",
    category: "portfolio",
    icon: FileText,
    accent: "#8be7ff",
    tags: ["resume", "experience", "stack"],
    desktop: true,
    launcher: true,
    commands: ["resume", "experience"],
    defaultWindow: { width: 640, height: 520, x: 164, y: 98 }
  },
  {
    id: "terminal",
    title: "Terminal",
    shortTitle: "Terminal",
    description: "Command-line tour through the portfolio OS.",
    category: "system",
    icon: TerminalSquare,
    accent: "#d8ff6f",
    tags: ["terminal", "commands", "system"],
    desktop: true,
    launcher: true,
    commands: ["terminal", "shell"],
    defaultWindow: { width: 650, height: 430, x: 236, y: 132 }
  },
  {
    id: "contact",
    title: "Contact",
    shortTitle: "Contact",
    description: "Interview and collaboration signal paths.",
    category: "portfolio",
    icon: Mail,
    accent: "#ff8fab",
    tags: ["contact", "email", "links"],
    desktop: true,
    launcher: true,
    commands: ["contact", "email"],
    defaultWindow: { width: 540, height: 420, x: 310, y: 104 }
  },
  {
    id: "planner",
    title: "Planner",
    shortTitle: "Planner",
    description: "Demo task board for the build roadmap.",
    category: "productivity",
    icon: CalendarCheck,
    accent: "#c6a7ff",
    tags: ["planner", "roadmap", "demo data"],
    desktop: true,
    launcher: true,
    commands: ["planner", "tasks"],
    defaultWindow: { width: 600, height: 450, x: 128, y: 146 }
  },
  {
    id: "budget",
    title: "Budget",
    shortTitle: "Budget",
    description: "Fake spending model for portfolio ops.",
    category: "productivity",
    icon: WalletCards,
    accent: "#ffd166",
    tags: ["budget", "demo data", "ops"],
    desktop: true,
    launcher: true,
    commands: ["budget", "spend"],
    defaultWindow: { width: 590, height: 430, x: 214, y: 172 }
  },
  {
    id: "habits",
    title: "Habits",
    shortTitle: "Habits",
    description: "Demo streaks for consistent portfolio growth.",
    category: "productivity",
    icon: Flame,
    accent: "#ff9f6e",
    tags: ["habits", "demo data", "streaks"],
    desktop: true,
    launcher: true,
    commands: ["habits", "streaks"],
    defaultWindow: { width: 560, height: 410, x: 282, y: 154 }
  },
  {
    id: "world",
    title: "Launch World",
    shortTitle: "World",
    description: "Roadmap and boot flow for the later 3D portfolio mode.",
    category: "system",
    icon: Orbit,
    accent: "#f1a084",
    tags: ["3d", "roadmap", "prototype"],
    desktop: true,
    launcher: true,
    commands: ["world", "launch-world"],
    defaultWindow: { width: 620, height: 440, x: 340, y: 146 }
  }
];

export function getAppDefinition(appId: AppDefinition["id"]) {
  const definition = appRegistry.find((app) => app.id === appId);
  if (!definition) {
    throw new Error(`Unknown portfolio OS app: ${appId}`);
  }

  return definition;
}
