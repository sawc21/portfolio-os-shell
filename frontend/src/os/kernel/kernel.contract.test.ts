import { describe, expect, test } from "vitest";
import type { AppId, SystemAction } from "../../lib/types";
import { portfolioKernel } from "./kernel";

function expectOpenApp(action: SystemAction, appId: AppId) {
  expect(action).toMatchObject({ type: "open-app", appId });
}

describe("portfolio kernel contract", () => {
  test("registry exposes unique apps with searchable command aliases", () => {
    const apps = portfolioKernel.getApps();
    const appIds = apps.map((app) => app.id);

    expect(new Set(appIds).size).toBe(appIds.length);
    expect(appIds).toContain("recruiter");
    expect(appIds).toContain("search");
    expect(appIds).toContain("files");
    expect(appIds).toContain("publications");
    expect(apps.every((app) => app.commands.length > 0)).toBe(true);
  });

  test("action factory creates typed actions for shared OS surfaces", () => {
    expect(portfolioKernel.actions.openApp("resume")).toEqual({ type: "open-app", appId: "resume" });
    expect(portfolioKernel.actions.openSearch("react")).toEqual({ type: "open-search", query: "react" });
    expect(portfolioKernel.actions.launchWorld()).toEqual({ type: "launch-world" });
  });

  test("file explorer entries resolve to typed actions", () => {
    const commandEntry = portfolioKernel.getFileSystemEntries().find((entry) => entry.id === "system-commands");
    const searchEntry = portfolioKernel.getFileSystemEntries().find((entry) => entry.id === "system-search");

    expect(commandEntry).toBeDefined();
    expect(searchEntry).toBeDefined();
    expect(portfolioKernel.getFileSystemEntryAction(commandEntry!)).toEqual({
      type: "open-app",
      appId: "terminal",
      params: { command: "help" }
    });
    expect(portfolioKernel.getFileSystemEntryAction(searchEntry!)).toEqual({ type: "open-search", query: "" });
  });

  test("commands parse into typed system actions", () => {
    expectOpenApp(portfolioKernel.runCommand("open projects"), "projects");
    expectOpenApp(portfolioKernel.runCommand("open case studies"), "case-studies");
    expectOpenApp(portfolioKernel.runCommand("papers"), "publications");
    expectOpenApp(portfolioKernel.runCommand("cv"), "publications");
    expectOpenApp(portfolioKernel.runCommand("contact"), "contact");

    expect(portfolioKernel.runCommand("search C#")).toEqual({ type: "open-search", query: "c#" });
    expect(portfolioKernel.runCommand("clear")).toEqual({ type: "clear" });

    const whoami = portfolioKernel.runCommand("whoami");
    expect(whoami.type).toBe("print");
    expect(whoami.type === "print" ? whoami.lines.join(" ") : "").toContain("Sawyer Cawthon");
  });

  test("search ranks hiring and technical proof across provider-backed data", () => {
    expect(portfolioKernel.search("hire sawyer")[0]).toMatchObject({
      title: "Hire Sawyer Cawthon",
      action: { type: "open-app", appId: "recruiter" }
    });

    expect(portfolioKernel.search("NASA").length).toBeGreaterThan(0);
    expect(portfolioKernel.search("QuickBooks").length).toBeGreaterThan(0);
    expect(portfolioKernel.search("integration")[0].title).toContain("QuickBooks");
    expect(portfolioKernel.search("Inventory")[0].title).toContain("Inventory");
    expect(portfolioKernel.search("Extraction")[0].title).toContain("Extraction");
    expect(portfolioKernel.search("paper")[0].action).toMatchObject({ type: "open-app", appId: "publications" });
    expect(portfolioKernel.search("knowledge graph")[0].action).toMatchObject({ type: "open-app", appId: "publications" });
    expect(portfolioKernel.search("contact")[0].action).toMatchObject({ type: "open-app", appId: "contact" });
  });
});
