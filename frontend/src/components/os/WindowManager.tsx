import {
  BudgetApp,
  ContactApp,
  HabitsApp,
  PlannerApp,
  ProjectsApp,
  ResumeApp,
  TerminalApp
} from "./apps/PortfolioApps";
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
};

export function WindowManager({
  windows,
  focusedAppId,
  openApp,
  launchWorld,
  onFocus,
  onClose,
  onMinimize,
  onMove
}: WindowManagerProps) {
  return (
    <div className="window-layer" aria-live="polite">
      {windows.map((window) => (
        <Window
          key={window.appId}
          window={window}
          focused={focusedAppId === window.appId}
          onFocus={onFocus}
          onClose={onClose}
          onMinimize={onMinimize}
          onMove={onMove}
        >
          {renderApp(window.appId, openApp, launchWorld)}
        </Window>
      ))}
    </div>
  );
}

function renderApp(appId: AppId, openApp: (appId: AppId) => void, launchWorld: () => void) {
  switch (appId) {
    case "projects":
      return <ProjectsApp />;
    case "resume":
      return <ResumeApp />;
    case "terminal":
      return <TerminalApp openApp={openApp} launchWorld={launchWorld} />;
    case "contact":
      return <ContactApp />;
    case "planner":
      return <PlannerApp />;
    case "budget":
      return <BudgetApp />;
    case "habits":
      return <HabitsApp />;
    default:
      return null;
  }
}
