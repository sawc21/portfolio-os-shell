import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { AppDefinition } from "../../lib/types";
import { portfolioKernel } from "../../os/kernel/kernel";

type StartMenuProps = {
  open: boolean;
  onOpenApp: (appId: AppDefinition["id"]) => void;
  onLaunchWorld: () => void;
  onResetWorkspace: () => void;
};

export function StartMenu({ open, onOpenApp, onLaunchWorld, onResetWorkspace }: StartMenuProps) {
  const [query, setQuery] = useState("");
  const visibleApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return portfolioKernel.getLauncherApps();
    }

    const seen = new Set<string>();
    return portfolioKernel.search(query)
      .map((result) => result.action.type === "open-app" ? portfolioKernel.getAppById(result.action.appId) : null)
      .filter((app): app is AppDefinition => Boolean(app))
      .filter((app) => {
        if (seen.has(app.id)) {
          return false;
        }
        seen.add(app.id);
        return app.launcher;
      });
  }, [query]);

  if (!open) {
    return null;
  }

  return (
    <section className="start-menu" aria-label="Portfolio OS start menu">
      <div className="start-menu__brand" aria-hidden="true">
        <span>Portfolio</span>
        <strong>OS 95</strong>
      </div>
      <div className="start-menu__body">
        <div className="start-menu__top">
          <div>
            <span className="os-label">kernel.gallery</span>
            <strong>Portfolio OS</strong>
          </div>
          <button className="start-menu__launch" type="button" onClick={onLaunchWorld}>
            <Sparkles aria-hidden="true" size={16} />
            Launch World
          </button>
        </div>
        <label className="start-menu__search">
          <Search aria-hidden="true" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find apps or commands"
            aria-label="Search Portfolio OS apps"
            autoFocus
          />
        </label>
        <div className="start-menu__grid">
          {visibleApps.map((app) => {
            const Icon = app.icon;
            return (
              <button key={app.id} type="button" onClick={() => onOpenApp(app.id)}>
                <Icon aria-hidden="true" size={20} />
                <span>{app.title}</span>
                <small>{app.category}</small>
              </button>
            );
          })}
        </div>
        <button className="start-menu__reset" type="button" onClick={onResetWorkspace}>
          Reset workspace layout
        </button>
      </div>
    </section>
  );
}
