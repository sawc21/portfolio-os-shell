import { Grid2X2, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [clock, setClock] = useState(() => formatClock());

  useEffect(() => {
    const interval = window.setInterval(() => setClock(formatClock()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

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
              className={[
                focusedAppId === window.appId && !window.minimized ? "is-active" : "",
                window.minimized ? "is-minimized" : ""
              ].filter(Boolean).join(" ") || undefined}
              type="button"
              onClick={() => onFocusWindow(window.appId)}
              aria-pressed={focusedAppId === window.appId && !window.minimized}
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
      <time className="os-taskbar__clock">{clock}</time>
    </footer>
  );
}

function formatClock() {
  return new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
}
