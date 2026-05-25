import type { AppId, SystemAction } from "../../lib/types";
import type { PortfolioDataProvider } from "../services/portfolioDataProvider";
import { getApps } from "./appRegistry";
import { systemActions } from "./systemActions";

export type CommandDefinition = {
  name: string;
  description: string;
  aliases: string[];
  targetAppId?: AppId;
};

export const commandDefinitions: CommandDefinition[] = [
  { name: "help", description: "Show available commands", aliases: ["help"] },
  { name: "apps", description: "List registered OS apps", aliases: ["apps", "list apps", "ls"] },
  { name: "search <query>", description: "Open Sawyer Search with a query", aliases: ["search"] },
  { name: "files", description: "Open File Explorer", aliases: ["files", "explorer", "dir"], targetAppId: "files" },
  { name: "open projects", description: "Open Projects", aliases: ["open projects", "projects"], targetAppId: "projects" },
  { name: "open resume", description: "Open Resume", aliases: ["open resume", "resume"], targetAppId: "resume" },
  { name: "open recruiter", description: "Open Recruiter Quick View", aliases: ["open recruiter", "recruiter"], targetAppId: "recruiter" },
  { name: "open contact", description: "Open Contact", aliases: ["open contact", "contact"], targetAppId: "contact" },
  { name: "open skills", description: "Open Skills", aliases: ["open skills", "skills", "stack"], targetAppId: "skills" },
  { name: "open case studies", description: "Open Case Studies", aliases: ["open case studies", "case studies", "cases"], targetAppId: "case-studies" },
  { name: "open ai lab", description: "Open AI Lab", aliases: ["open ai lab", "ai", "ai lab", "llm"], targetAppId: "ai-lab" },
  { name: "open agents", description: "Open Agent Console", aliases: ["open agents", "agents", "agent console", "tools"], targetAppId: "agent-console" },
  { name: "hire sawyer", description: "Open the hiring-focused recruiter view", aliases: ["hire sawyer", "why hire sawyer"], targetAppId: "recruiter" },
  { name: "whoami", description: "Print Sawyer's role positioning", aliases: ["whoami", "about"] },
  { name: "launch world", description: "Start the desktop-to-world transition", aliases: ["launch world", "launch-world", "world"] },
  { name: "reset os", description: "Reset workspace and demo app state", aliases: ["reset os", "reset"] },
  { name: "clear", description: "Clear terminal output", aliases: ["clear"] }
];

export function runKernelCommand(rawCommand: string, provider: PortfolioDataProvider): SystemAction {
  const command = rawCommand.trim().toLowerCase();

  if (command === "" || command === "help") {
    return systemActions.print(commandDefinitions.map((definition) => `${definition.name.padEnd(18)} ${definition.description}`));
  }

  if (command === "clear") {
    return systemActions.clear();
  }

  if (command === "apps" || command === "list apps" || command === "ls") {
    return systemActions.print(
      getApps()
        .filter((app) => app.launcher)
        .map((app) => `${app.id.padEnd(13)} ${app.title} / ${app.category}`)
    );
  }

  if (command.startsWith("search ")) {
    return systemActions.openSearch(command.slice(7).trim());
  }

  if (command === "hire sawyer" || command === "why hire sawyer") {
    return systemActions.openApp("recruiter");
  }

  if (command === "whoami") {
    const profile = provider.getRecruiterProfile();
    return systemActions.print([
      profile.name,
      profile.targetRoles.join(" / "),
      profile.shortPitch,
      profile.valueProposition
    ]);
  }

  if (command === "launch world" || command === "launch-world" || command === "world") {
    return systemActions.launchWorld();
  }

  if (command === "reset os" || command === "reset") {
    return systemActions.resetOs();
  }

  const appCommand = command.startsWith("open ") ? command.slice(5).trim() : command;
  const app = getApps().find((candidate) => {
    const aliases = [
      candidate.id,
      candidate.title.toLowerCase(),
      candidate.shortTitle.toLowerCase(),
      ...candidate.commands
    ];

    return aliases.includes(appCommand);
  });

  if (app) {
    return app.id === "world" ? systemActions.launchWorld() : systemActions.openApp(app.id);
  }

  return systemActions.print([`Unknown command: ${rawCommand}`, "Type help, apps, search ai, or hire sawyer."]);
}
