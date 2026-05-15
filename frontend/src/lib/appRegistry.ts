import {
  CalendarCheck,
  FileText,
  Flame,
  FolderKanban,
  Mail,
  TerminalSquare,
  WalletCards
} from "lucide-react";
import type { AppDefinition } from "./types";

export const appRegistry: AppDefinition[] = [
  {
    id: "projects",
    title: "Projects",
    shortTitle: "Projects",
    description: "Case studies, branches, and technical proof.",
    category: "portfolio",
    icon: FolderKanban,
    accent: "#55f0c2",
    defaultSize: { width: 680, height: 470 },
    defaultPosition: { x: 84, y: 74 }
  },
  {
    id: "resume",
    title: "Resume",
    shortTitle: "Resume",
    description: "Stack depth, operating modes, and proof to add.",
    category: "portfolio",
    icon: FileText,
    accent: "#8be7ff",
    defaultSize: { width: 620, height: 520 },
    defaultPosition: { x: 164, y: 98 }
  },
  {
    id: "terminal",
    title: "Terminal",
    shortTitle: "Terminal",
    description: "Command-line tour through the portfolio OS.",
    category: "system",
    icon: TerminalSquare,
    accent: "#d8ff6f",
    defaultSize: { width: 640, height: 430 },
    defaultPosition: { x: 236, y: 132 }
  },
  {
    id: "contact",
    title: "Contact",
    shortTitle: "Contact",
    description: "Interview and collaboration signal paths.",
    category: "portfolio",
    icon: Mail,
    accent: "#ff8fab",
    defaultSize: { width: 540, height: 420 },
    defaultPosition: { x: 310, y: 104 }
  },
  {
    id: "planner",
    title: "Planner",
    shortTitle: "Planner",
    description: "Demo task board for the build roadmap.",
    category: "productivity",
    icon: CalendarCheck,
    accent: "#c6a7ff",
    defaultSize: { width: 600, height: 450 },
    defaultPosition: { x: 128, y: 146 }
  },
  {
    id: "budget",
    title: "Budget",
    shortTitle: "Budget",
    description: "Fake spending model for portfolio ops.",
    category: "productivity",
    icon: WalletCards,
    accent: "#ffd166",
    defaultSize: { width: 590, height: 430 },
    defaultPosition: { x: 214, y: 172 }
  },
  {
    id: "habits",
    title: "Habits",
    shortTitle: "Habits",
    description: "Demo streaks for consistent portfolio growth.",
    category: "productivity",
    icon: Flame,
    accent: "#ff9f6e",
    defaultSize: { width: 560, height: 410 },
    defaultPosition: { x: 282, y: 154 }
  }
];

export function getAppDefinition(appId: AppDefinition["id"]) {
  const definition = appRegistry.find((app) => app.id === appId);
  if (!definition) {
    throw new Error(`Unknown portfolio OS app: ${appId}`);
  }

  return definition;
}
