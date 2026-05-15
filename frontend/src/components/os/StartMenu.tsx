import { Search, Sparkles } from "lucide-react";
import { appRegistry } from "../../lib/appRegistry";
import type { AppDefinition } from "../../lib/types";

type StartMenuProps = {
  open: boolean;
  onOpenApp: (appId: AppDefinition["id"]) => void;
  onLaunchWorld: () => void;
};

export function StartMenu({ open, onOpenApp, onLaunchWorld }: StartMenuProps) {
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
        <span>Search apps</span>
      </label>
      <div className="start-menu__grid">
        {appRegistry.map((app) => {
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
    </section>
  );
}
