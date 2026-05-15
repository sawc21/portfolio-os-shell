import { appComponents } from "./apps/appComponents";
import { Window } from "./Window";
import type { AppId, WindowInstance } from "../../lib/types";

type WindowManagerProps = {
  windows: WindowInstance[];
  focusedAppId: AppId | null;
  openApp: (appId: AppId) => void;
  launchWorld: () => void;
  onFocus: (appId: AppId) => void;
  onClose: (appId: AppId) => void;
  onMinimize: (appId: AppId) => void;
  onMove: (appId: AppId, x: number, y: number) => void;
  onResize: (appId: AppId, width: number, height: number) => void;
  onToggleMaximize: (appId: AppId) => void;
};

export function WindowManager({
  windows,
  focusedAppId,
  openApp,
  launchWorld,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  onResize,
  onToggleMaximize
}: WindowManagerProps) {
  return (
    <div className="window-layer" aria-live="polite">
      {windows.map((window) => {
        const AppComponent = appComponents[window.appId];

        return (
          <Window
            key={window.appId}
            window={window}
            focused={focusedAppId === window.appId}
            onFocus={onFocus}
            onClose={onClose}
            onMinimize={onMinimize}
            onMove={onMove}
            onResize={onResize}
            onToggleMaximize={onToggleMaximize}
          >
            <AppComponent openApp={openApp} launchWorld={launchWorld} />
          </Window>
        );
      })}
    </div>
  );
}
