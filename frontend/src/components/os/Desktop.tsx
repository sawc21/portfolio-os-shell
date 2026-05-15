import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { appRegistry, getAppDefinition } from "../../lib/appRegistry";
import type { AppId, WindowInstance } from "../../lib/types";
import { DesktopIcon } from "./DesktopIcon";
import { StartMenu } from "./StartMenu";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "./WindowManager";
import { WorldPreview } from "./WorldPreview";

type WorldMode = "desktop" | "booting" | "world";

const initialApps: AppId[] = ["projects", "terminal"];

export function Desktop() {
  const [windows, setWindows] = useState<WindowInstance[]>(() => initialApps.map(createWindow));
  const [focusedAppId, setFocusedAppId] = useState<AppId | null>("terminal");
  const [startOpen, setStartOpen] = useState(false);
  const [worldMode, setWorldMode] = useState<WorldMode>("desktop");
  const [zCursor, setZCursor] = useState(20);

  const visibleDesktopApps = useMemo(() => appRegistry.filter((app) => app.category !== "system"), []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setStartOpen(false);
        if (worldMode === "world") {
          setWorldMode("desktop");
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [worldMode]);

  function focusWindow(appId: AppId) {
    const nextZ = zCursor + 1;
    setZCursor(nextZ);
    setFocusedAppId(appId);
    setWindows((current) =>
      current.map((window) =>
        window.appId === appId ? { ...window, minimized: false, zIndex: nextZ } : window
      )
    );
  }

  function openApp(appId: AppId) {
    setStartOpen(false);
    setWindows((current) => {
      if (current.some((window) => window.appId === appId)) {
        return current;
      }

      return [...current, { ...createWindow(appId), zIndex: zCursor + 1 }];
    });
    setZCursor((current) => current + 1);
    window.setTimeout(() => focusWindow(appId), 0);
  }

  function closeWindow(appId: AppId) {
    setWindows((current) => current.filter((window) => window.appId !== appId));
    setFocusedAppId((current) => (current === appId ? null : current));
  }

  function minimizeWindow(appId: AppId) {
    setWindows((current) =>
      current.map((window) => (window.appId === appId ? { ...window, minimized: true } : window))
    );
    setFocusedAppId((current) => (current === appId ? null : current));
  }

  function moveWindow(appId: AppId, x: number, y: number) {
    setWindows((current) =>
      current.map((window) => (window.appId === appId ? { ...window, x, y } : window))
    );
  }

  function launchWorld() {
    setStartOpen(false);
    setWorldMode("booting");
    window.setTimeout(() => setWorldMode("world"), 2500);
  }

  return (
    <section className="portfolio-os" aria-label="Portfolio operating system">
      <div className="desktop-backdrop" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <header className="os-topline">
        <div>
          <span className="os-label">portfolio operating system</span>
          <strong>Sawyer Cawthon</strong>
        </div>
        <p>Interactive internship portfolio / ASP.NET shell / React desktop</p>
      </header>
      <main className="desktop-surface" data-world-mode={worldMode}>
        <div className="desktop-icons" aria-label="Desktop apps">
          {visibleDesktopApps.map((app) => (
            <DesktopIcon
              key={app.id}
              app={app}
              onOpen={openApp}
              launchingWorld={worldMode === "booting"}
            />
          ))}
        </div>
        <WindowManager
          windows={windows}
          focusedAppId={focusedAppId}
          openApp={openApp}
          launchWorld={launchWorld}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMove={moveWindow}
        />
        <AnimatePresence>
          {startOpen ? (
            <motion.div
              className="start-menu-wrap"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <StartMenu open={startOpen} onOpenApp={openApp} onLaunchWorld={launchWorld} />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <WorldPreview mode={worldMode} onExitWorld={() => setWorldMode("desktop")} />
      </main>
      <Taskbar
        windows={windows}
        focusedAppId={focusedAppId}
        startOpen={startOpen}
        onToggleStart={() => setStartOpen((open) => !open)}
        onFocusWindow={focusWindow}
        onLaunchWorld={launchWorld}
      />
    </section>
  );
}

function createWindow(appId: AppId): WindowInstance {
  const definition = getAppDefinition(appId);

  return {
    appId,
    x: definition.defaultPosition.x,
    y: definition.defaultPosition.y,
    width: definition.defaultSize.width,
    height: definition.defaultSize.height,
    zIndex: appId === "terminal" ? 12 : 10,
    minimized: false
  };
}
