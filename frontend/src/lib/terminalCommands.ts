import { appRegistry } from "./appRegistry";
import type { AppId } from "./types";

export type TerminalAction =
  | { type: "open"; appId: AppId }
  | { type: "launch-world" }
  | { type: "clear" }
  | { type: "print"; lines: string[] };

const commandSummaries = [
  "help              Show available commands",
  "apps              List registered OS apps",
  "open <app>        Open an app by id, title, or command alias",
  "whoami            Open About Me",
  "stack             Open Skills",
  "experience        Open Resume",
  "launch-world      Start the desktop-to-world transition",
  "clear             Clear terminal output"
];

export function runTerminalCommand(rawCommand: string): TerminalAction {
  const command = rawCommand.trim().toLowerCase();

  if (command === "help" || command === "") {
    return { type: "print", lines: commandSummaries };
  }

  if (command === "clear") {
    return { type: "clear" };
  }

  if (command === "apps" || command === "list apps" || command === "ls") {
    return {
      type: "print",
      lines: appRegistry
        .filter((app) => app.launcher)
        .map((app) => `${app.id.padEnd(13)} ${app.title} / ${app.category}`)
    };
  }

  if (command === "launch-world" || command === "world") {
    return { type: "launch-world" };
  }

  const appCommand = command.startsWith("open ") ? command.slice(5).trim() : command;
  const app = appRegistry.find((candidate) => {
    const aliases = [
      candidate.id,
      candidate.title.toLowerCase(),
      candidate.shortTitle.toLowerCase(),
      ...candidate.commands
    ];

    return aliases.includes(appCommand);
  });

  if (app) {
    return app.id === "world" ? { type: "launch-world" } : { type: "open", appId: app.id };
  }

  return {
    type: "print",
    lines: [`Unknown command: ${rawCommand}`, "Type help or apps to list supported commands."]
  };
}
