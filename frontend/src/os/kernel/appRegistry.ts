import { appRegistry, getAppDefinition } from "../../lib/appRegistry";
import type { AppDefinition, AppId } from "../../lib/types";

export function getApps(): AppDefinition[] {
  return appRegistry;
}

export function getLauncherApps(): AppDefinition[] {
  return appRegistry.filter((app) => app.launcher);
}

export function getDesktopApps(): AppDefinition[] {
  return appRegistry.filter((app) => app.desktop);
}

export function getAppById(appId: AppId): AppDefinition {
  return getAppDefinition(appId);
}
