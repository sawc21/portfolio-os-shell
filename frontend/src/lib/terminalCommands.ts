import { portfolioKernel } from "../os/kernel/kernel";

export const runTerminalCommand = portfolioKernel.runCommand;
export type { SystemAction as TerminalAction } from "./types";
