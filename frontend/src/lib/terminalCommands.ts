import type { AppId } from "./types";

export type TerminalAction =
  | { type: "open"; appId: AppId }
  | { type: "launch-world" }
  | { type: "clear" }
  | { type: "print"; lines: string[] };

const commandHelp = [
  "help              Show available commands",
  "projects          Open the Projects app",
  "resume            Open the Resume app",
  "contact           Open the Contact app",
  "launch-world      Start the desktop-to-world transition",
  "clear             Clear terminal output"
];

export function runTerminalCommand(rawCommand: string): TerminalAction {
  const command = rawCommand.trim().toLowerCase();

  if (command === "help" || command === "") {
    return { type: "print", lines: commandHelp };
  }

  if (command === "projects" || command === "open projects") {
    return { type: "open", appId: "projects" };
  }

  if (command === "resume" || command === "open resume") {
    return { type: "open", appId: "resume" };
  }

  if (command === "contact" || command === "open contact") {
    return { type: "open", appId: "contact" };
  }

  if (command === "launch-world" || command === "world") {
    return { type: "launch-world" };
  }

  if (command === "clear") {
    return { type: "clear" };
  }

  return {
    type: "print",
    lines: [`Unknown command: ${rawCommand}`, "Type help to list supported commands."]
  };
}
