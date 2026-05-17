import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { AppId, DesktopIconPosition, WindowInstance } from "../../lib/types";
import { portfolioKernel } from "../../os/kernel/kernel";
import { DesktopIcon } from "./DesktopIcon";
import { StartMenu } from "./StartMenu";
import { Taskbar } from "./Taskbar";
import { WindowManager } from "./WindowManager";
import { WorldPreview } from "./WorldPreview";

type WorldMode = "desktop" | "booting" | "world";
type IconPositionMap = Partial<Record<AppId, DesktopIconPosition>>;
type AppParamsMap = Partial<Record<AppId, unknown>>;

const initialApps: AppId[] = ["files"];
const windowsStorageKey = "portfolio-os:windows:v2";
const iconsStorageKey = "portfolio-os:desktop-icons:v2";

export function Desktop() {
  const [windows, setWindows] = useState<WindowInstance[]>(readWindowSession);
  const [focusedAppId, setFocusedAppId] = useState<AppId | null>("files");
  const [startOpen, setStartOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<AppId | null>(null);
  const [iconPositions, setIconPositions] = useState<IconPositionMap>(readIconPositions);
  const [appParams, setAppParams] = useState<AppParamsMap>({});
  const [worldMode, setWorldMode] = useState<WorldMode>("desktop");
  const [zCursor, setZCursor] = useState(30);

  const desktopApps = useMemo(() => portfolioKernel.getDesktopApps(), []);

  useEffect(() => {
    window.localStorage.setItem(windowsStorageKey, JSON.stringify(windows));
  }, [windows]);

  useEffect(() => {
    window.localStorage.setItem(iconsStorageKey, JSON.stringify(iconPositions));
  }, [iconPositions]);

  useEffect(() => {
    function handleResize() {
      setWindows((current) =>
        current.map((window) => ({ ...window, ...clampWindow(window) }))
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setStartOpen(true);
        return;
      }

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

  function openApp(appId: AppId, params?: unknown) {
    setStartOpen(false);
    setSelectedIconId(appId);
    if (params !== undefined) {
      setAppParams((current) => ({ ...current, [appId]: params }));
    }
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
      current.map((window) =>
        window.appId === appId ? { ...window, ...clampWindow({ ...window, x, y }) } : window
      )
    );
  }

  function resizeWindow(appId: AppId, width: number, height: number) {
    setWindows((current) =>
      current.map((window) =>
        window.appId === appId
          ? { ...window, width: Math.max(360, width), height: Math.max(300, height), maximized: false }
          : window
      )
    );
  }

  function toggleMaximize(appId: AppId) {
    setWindows((current) =>
      current.map((window) =>
        window.appId === appId ? { ...window, maximized: !window.maximized, minimized: false } : window
      )
    );
  }

  function moveIcon(appId: AppId, position: DesktopIconPosition) {
    setIconPositions((current) => ({ ...current, [appId]: position }));
  }

  function sortIcons() {
    setIconPositions({});
    setSelectedIconId(null);
  }

  function resetWorkspace() {
    portfolioKernel.resetDemoState();
    setIconPositions({});
    setWindows(initialApps.map(createWindow));
    setFocusedAppId("files");
    setSelectedIconId(null);
    setAppParams({});
  }

  function launchWorld() {
    setStartOpen(false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setWorldMode("world");
      return;
    }

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
      <main className="desktop-surface" data-world-mode={worldMode} onPointerDown={() => setSelectedIconId(null)}>
        <div className="desktop-controls" aria-label="Desktop layout controls">
          <button type="button" onClick={sortIcons}>Sort</button>
          <button type="button" onClick={resetWorkspace}>Reset OS</button>
        </div>
        <div className="desktop-icons" aria-label="Desktop apps">
          {desktopApps.map((app, index) => (
            <DesktopIcon
              key={app.id}
              app={app}
              index={index}
              position={iconPositions[app.id]}
              selected={selectedIconId === app.id}
              onSelect={setSelectedIconId}
              onMove={moveIcon}
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
          resetWorkspace={resetWorkspace}
          appParams={appParams}
          onFocus={focusWindow}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMove={moveWindow}
          onResize={resizeWindow}
          onToggleMaximize={toggleMaximize}
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
              <StartMenu
                open={startOpen}
                onOpenApp={openApp}
                onLaunchWorld={launchWorld}
                onResetWorkspace={resetWorkspace}
              />
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
        onOpenApp={openApp}
        onFocusWindow={focusWindow}
        onLaunchWorld={launchWorld}
      />
    </section>
  );
}

function createWindow(appId: AppId): WindowInstance {
  const definition = portfolioKernel.getAppById(appId);

  return {
    appId,
    x: definition.defaultWindow.x,
    y: definition.defaultWindow.y,
    width: definition.defaultWindow.width,
    height: definition.defaultWindow.height,
    zIndex: appId === "terminal" ? 14 : 10,
    minimized: false,
    maximized: false
  };
}

function clampWindow(window: WindowInstance) {
  const maxX = Math.max(12, globalThis.window.innerWidth - 120);
  const maxY = Math.max(12, globalThis.window.innerHeight - 120);

  return {
    x: Math.min(Math.max(12, window.x), maxX),
    y: Math.min(Math.max(12, window.y), maxY)
  };
}

function readWindowSession(): WindowInstance[] {
  const fallback = initialApps.map(createWindow);
  const stored = window.localStorage.getItem(windowsStorageKey);

  if (!stored) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored) as WindowInstance[];
    const knownIds = new Set(portfolioKernel.getApps().map((app) => app.id));
    const restored = parsed.filter((window) => knownIds.has(window.appId));
    return restored.length > 0 ? restored.map((window) => ({ ...createWindow(window.appId), ...window })) : fallback;
  } catch (error) {
    console.warn("Unable to restore Portfolio OS window session.", error);
    return fallback;
  }
}

function readIconPositions(): IconPositionMap {
  const stored = window.localStorage.getItem(iconsStorageKey);

  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored) as IconPositionMap;
  } catch (error) {
    console.warn("Unable to restore Portfolio OS icon layout.", error);
    return {};
  }
}
