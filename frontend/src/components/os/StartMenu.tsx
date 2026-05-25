import { Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { trapTabKey } from "../../lib/focusTrap";
import type { AppDefinition, SearchResult, SystemAction } from "../../lib/types";
import { portfolioKernel } from "../../os/kernel/kernel";
import { AppPixelIcon } from "./AppPixelIcon";

type StartMenuProps = {
  open: boolean;
  onRunAction: (action: SystemAction) => void;
};

type LauncherItem =
  | { kind: "app"; app: AppDefinition; action: SystemAction }
  | { kind: "result"; result: SearchResult; action: SystemAction };

export function StartMenu({ open, onRunAction }: StartMenuProps) {
  const menuRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const visibleItems = useMemo<LauncherItem[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return portfolioKernel.getLauncherApps().map((app) => ({
        kind: "app",
        app,
        action: portfolioKernel.actions.openApp(app.id)
      }));
    }

    const seen = new Set<string>();
    return portfolioKernel.search(query)
      .filter((result) => {
        if (seen.has(result.id)) {
          return false;
        }
        seen.add(result.id);
        return true;
      })
      .map((result) => ({
        kind: "result",
        result,
        action: result.action
      }));
  }, [query]);

  if (!open) {
    return null;
  }

  return (
    <section
      ref={menuRef}
      className="start-menu"
      aria-label="Portfolio OS start menu"
      onKeyDown={(event) => trapTabKey(event, menuRef.current)}
    >
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
          <button className="start-menu__launch" type="button" onClick={() => onRunAction(portfolioKernel.actions.launchWorld())}>
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
          {visibleItems.map((item) => {
            const app = item.kind === "app"
              ? item.app
              : item.action.type === "open-app" || item.action.type === "focus-app"
                ? portfolioKernel.getAppById(item.action.appId)
                : null;
            const title = item.kind === "app" ? item.app.title : item.result.title;
            const category = item.kind === "app" ? item.app.category : item.result.category;
            const description = item.kind === "app" ? item.app.description : item.result.description;

            return (
              <motion.button
                key={item.kind === "app" ? item.app.id : item.result.id}
                type="button"
                onClick={() => onRunAction(item.action)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
              >
                {app ? <AppPixelIcon app={app} className="start-menu__app-icon" fallbackSize={20} /> : <Search aria-hidden="true" size={20} />}
                <span>{title}</span>
                <small>{category} / {description}</small>
              </motion.button>
            );
          })}
        </div>
        <button className="start-menu__reset" type="button" onClick={() => onRunAction(portfolioKernel.actions.resetOs())}>
          Reset workspace layout
        </button>
      </div>
    </section>
  );
}
