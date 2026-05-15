import type { SystemAction } from "../../lib/types";

export type { SystemAction };

export function printLines(lines: string[]): SystemAction {
  return { type: "print", lines };
}
