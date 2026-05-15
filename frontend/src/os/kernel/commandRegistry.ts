import type { AppId, SystemAction } from "../../lib/types";
import type { PortfolioDataProvider } from "../services/portfolioDataProvider";
import { getApps } from "./appRegistry";

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
  { name: "open recruiter", description: "Open Recruiter Quick View", aliases: ["open recruiter", "recruiter"], targetAppId: "recruiter" },
  { name: "hire sawyer", description: "Open the hiring-focused recruiter view", aliases: ["hire sawyer", "why hire sawyer"], targetAppId: "recruiter" },
  { name: "skills", description: "Open Skills", aliases: ["skills", "stack"], targetAppId: "skills" },
  { name: "contact", description: "Open Contact", aliases: ["contact", "email"], targetAppId: "contact" },
  { name: "launch world", description: "Start the desktop-to-world transition", aliases: ["launch world", "launch-world", "world"] },
  { name: "reset os", description: "Reset workspace and demo app state", aliases: ["reset os", "reset"] },
  { name: "clear", description: "Clear terminal output", aliases: ["clear"] }
];

export function runKernelCommand(rawCommand: string, _provider: PortfolioDataProvider): SystemAction {
  const command = rawCommand.trim().toLowerCase();

  if (command === "" || command === "help") {
    return {
      type: "print",
      lines: commandDefinitions.map((definition) => `${definition.name.padEnd(18)} ${definition.description}`)
    };
  }

  if (command === "clear") {
    return { type: "clear" };
  }

  if (command === "apps" || command === "list apps" || command === "ls") {
    return {
      type: "print",
      lines: getApps()
        .filter((app) => app.launcher)
        .map((app) => `${app.id.padEnd(13)} ${app.title} / ${app.category}`)
    };
  }

  if (command.startsWith("search ")) {
    return { type: "open-search", query: command.slice(7).trim() };
  }

  if (command === "hire sawyer" || command === "why hire sawyer") {
    return { type: "open-app", appId: "recruiter" };
  }

  if (command === "launch world" || command === "launch-world" || command === "world") {
    return { type: "launch-world" };
  }

  if (command === "reset os" || command === "reset") {
    return { type: "reset-os" };
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
    return app.id === "world" ? { type: "launch-world" } : { type: "open-app", appId: app.id };
  }

  return {
    type: "print",
    lines: [`Unknown command: ${rawCommand}`, "Type help, apps, search react, or hire sawyer."]
  };
}
