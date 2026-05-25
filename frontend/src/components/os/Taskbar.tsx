import { BatteryCharging, Grid2X2, Rocket, ShieldCheck, Volume2, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppDefinition } from "../../lib/appRegistry";
import type { AppId, SystemAction, WindowInstance } from "../../lib/types";
import { portfolioKernel } from "../../os/kernel/kernel";
import { AppPixelIcon } from "./AppPixelIcon";

type TaskbarProps = {
  windows: WindowInstance[];
  focusedAppId: AppId | null;
  startOpen: boolean;
  onToggleStart: () => void;
  onRunAction: (action: SystemAction) => void;
};

export function Taskbar({
  windows,
  focusedAppId,
  startOpen,
  onToggleStart,
  onRunAction
}: TaskbarProps) {
  const [clock, setClock] = useState(() => formatClock());
  const quickLaunchApps: AppId[] = ["files", "search", "terminal"];

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
      <div className="os-taskbar__quick-launch" aria-label="Quick launch">
        {quickLaunchApps.map((appId) => {
          const app = getAppDefinition(appId);
          return (
            <button key={appId} type="button" onClick={() => onRunAction(portfolioKernel.actions.openApp(appId))} aria-label={`Open ${app.title}`}>
              <AppPixelIcon app={app} className="os-taskbar__icon" fallbackSize={15} />
            </button>
          );
        })}
      </div>
      <div className="os-taskbar__windows" aria-label="Open windows">
        {windows.map((window) => {
          const app = getAppDefinition(window.appId);
          return (
            <button
              key={window.appId}
              className={[
                focusedAppId === window.appId && !window.minimized ? "is-active" : "",
                window.minimized ? "is-minimized" : ""
              ].filter(Boolean).join(" ") || undefined}
              type="button"
              onClick={() => onRunAction(portfolioKernel.actions.focusApp(window.appId))}
              aria-pressed={focusedAppId === window.appId && !window.minimized}
            >
              <AppPixelIcon app={app} className="os-taskbar__icon" fallbackSize={16} />
              {app.shortTitle}
            </button>
          );
        })}
      </div>
      <button className="os-taskbar__world" type="button" onClick={() => onRunAction(portfolioKernel.actions.launchWorld())}>
        <Rocket aria-hidden="true" size={17} />
        Launch World
      </button>
      <div className="os-taskbar__tray" aria-label="System tray">
        <span className="os-taskbar__hotkey">Ctrl+Alt+N</span>
        <ShieldCheck aria-hidden="true" size={15} />
        <Wifi aria-hidden="true" size={15} />
        <Volume2 aria-hidden="true" size={15} />
        <BatteryCharging aria-hidden="true" size={15} />
        <time className="os-taskbar__clock">{clock}</time>
      </div>
    </footer>
  );
}

function formatClock() {
  return new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
}
