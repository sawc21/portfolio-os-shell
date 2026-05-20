import type { AppId, SystemAction } from "../../lib/types";

export type { SystemAction };

function withOptionalParams(type: "open-app" | "focus-app", appId: AppId, params?: unknown): SystemAction {
  return params === undefined ? { type, appId } : { type, appId, params };
}

export const systemActions = {
  openApp: (appId: AppId, params?: unknown): SystemAction => withOptionalParams("open-app", appId, params),
  focusApp: (appId: AppId, params?: unknown): SystemAction => withOptionalParams("focus-app", appId, params),
  openSearch: (query: string): SystemAction => ({ type: "open-search", query }),
  launchWorld: (): SystemAction => ({ type: "launch-world" }),
  resetOs: (): SystemAction => ({ type: "reset-os" }),
  clear: (): SystemAction => ({ type: "clear" }),
  print: (lines: string[]): SystemAction => ({ type: "print", lines }),
  openUrl: (href: string): SystemAction => ({ type: "open-url", href }),
  copyText: (text: string, label?: string): SystemAction =>
    label === undefined ? { type: "copy-text", text } : { type: "copy-text", text, label },
  downloadUrl: (href: string, filename?: string): SystemAction =>
    filename === undefined ? { type: "download-url", href } : { type: "download-url", href, filename }
};

export function printLines(lines: string[]): SystemAction {
  return systemActions.print(lines);
}

export function describeSystemAction(action: SystemAction): string | null {
  switch (action.type) {
    case "open-app":
      return `Opening ${action.appId}...`;
    case "focus-app":
      return `Focusing ${action.appId}...`;
    case "open-search":
      return `Searching for ${action.query}...`;
    case "launch-world":
      return "Launching world interface...";
    case "reset-os":
      return "Portfolio OS workspace and demo state reset.";
    case "open-url":
      return `Opening ${action.href}...`;
    case "copy-text":
      return `Copied ${action.label ?? "text"} to clipboard.`;
    case "download-url":
      return `Downloading ${action.filename ?? action.href}...`;
    case "clear":
    case "print":
      return null;
  }
}
