import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { appRegistry } from "../../lib/appRegistry";
import type { AppDefinition } from "../../lib/types";

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

    return appRegistry
      .filter((app) => app.launcher)
      .filter((app) => {
        if (!normalizedQuery) {
          return true;
        }

        return [app.title, app.shortTitle, app.category, ...app.tags, ...app.commands]
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      });
  }, [query]);

  if (!open) {
    return null;
  }

  return (
    <section className="start-menu" aria-label="Portfolio OS start menu">
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
          placeholder="Search apps or commands"
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
    </section>
  );
}
