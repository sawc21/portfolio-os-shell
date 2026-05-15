import { Grid2X2, Rocket } from "lucide-react";
import { getAppDefinition } from "../../lib/appRegistry";
import type { AppId, WindowInstance } from "../../lib/types";

type TaskbarProps = {
  windows: WindowInstance[];
  focusedAppId: AppId | null;
  startOpen: boolean;
  onToggleStart: () => void;
  onFocusWindow: (appId: AppId) => void;
  onLaunchWorld: () => void;
};

export function Taskbar({
  windows,
  focusedAppId,
  startOpen,
  onToggleStart,
  onFocusWindow,
  onLaunchWorld
}: TaskbarProps) {
  return (
    <footer className="os-taskbar" aria-label="Portfolio OS taskbar">
      <button
        className="os-taskbar__start"
        type="button"
        aria-expanded={startOpen}
        onClick={onToggleStart}
      >
        <Grid2X2 aria-hidden="true" size={18} />
        Start
      </button>
      <div className="os-taskbar__windows" aria-label="Open windows">
        {windows.map((window) => {
          const app = getAppDefinition(window.appId);
          const Icon = app.icon;
          return (
            <button
              key={window.appId}
              className={focusedAppId === window.appId && !window.minimized ? "is-active" : undefined}
              type="button"
              onClick={() => onFocusWindow(window.appId)}
            >
              <Icon aria-hidden="true" size={16} />
              {app.shortTitle}
            </button>
          );
        })}
      </div>
      <button className="os-taskbar__world" type="button" onClick={onLaunchWorld}>
        <Rocket aria-hidden="true" size={17} />
        Launch World
      </button>
      <time className="os-taskbar__clock">10:26</time>
    </footer>
  );
}
