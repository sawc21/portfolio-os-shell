import { Maximize2, Minus, X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { getAppDefinition } from "../../lib/appRegistry";
import type { AppId, WindowInstance } from "../../lib/types";
import { AppPixelIcon } from "./AppPixelIcon";

type WindowProps = {
  window: WindowInstance;
  focused: boolean;
  children: ReactNode;
  onFocus: (appId: AppId) => void;
  onClose: (appId: AppId) => void;
  onMinimize: (appId: AppId) => void;
  onMove: (appId: AppId, x: number, y: number) => void;
  onResize: (appId: AppId, width: number, height: number) => void;
  onToggleMaximize: (appId: AppId) => void;
};

export function Window({
  window,
  focused,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  onResize,
  onToggleMaximize
}: WindowProps) {
  const app = getAppDefinition(window.appId);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    if (window.maximized) {
      return;
    }

    onFocus(window.appId);
    const originX = event.clientX;
    const originY = event.clientY;
    const startX = window.x;
    const startY = window.y;
    event.currentTarget.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      onMove(
        window.appId,
        Math.max(12, startX + moveEvent.clientX - originX),
        Math.max(12, startY + moveEvent.clientY - originY)
      );
    };

    const handlePointerUp = () => {
      globalThis.window.removeEventListener("pointermove", handlePointerMove);
      globalThis.window.removeEventListener("pointerup", handlePointerUp);
    };

    globalThis.window.addEventListener("pointermove", handlePointerMove);
    globalThis.window.addEventListener("pointerup", handlePointerUp);
  }

  function handleResizePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onFocus(window.appId);
    const originX = event.clientX;
    const originY = event.clientY;
    const startWidth = window.width;
    const startHeight = window.height;
    event.currentTarget.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      onResize(
        window.appId,
        startWidth + moveEvent.clientX - originX,
        startHeight + moveEvent.clientY - originY
      );
    };

    const handlePointerUp = () => {
      globalThis.window.removeEventListener("pointermove", handlePointerMove);
      globalThis.window.removeEventListener("pointerup", handlePointerUp);
    };

    globalThis.window.addEventListener("pointermove", handlePointerMove);
    globalThis.window.addEventListener("pointerup", handlePointerUp);
  }

  if (window.minimized) {
    return null;
  }

  return (
    <section
      className="os-window"
      data-focused={focused ? "true" : "false"}
      data-maximized={window.maximized ? "true" : "false"}
      style={
        {
          "--app-accent": app.accent,
          left: window.maximized ? 12 : window.x,
          top: window.maximized ? 12 : window.y,
          width: window.maximized ? "calc(100% - 24px)" : window.width,
          height: window.maximized ? "calc(100% - 24px)" : window.height,
          zIndex: window.zIndex
        } as React.CSSProperties
      }
      aria-label={`${app.title} window`}
      onPointerDown={() => onFocus(window.appId)}
    >
      <div className="os-window__titlebar" onPointerDown={handlePointerDown}>
        <div className="os-window__title">
          <AppPixelIcon app={app} className="os-window__title-icon" fallbackSize={17} />
          <span>{app.title}</span>
        </div>
        <div className="os-window__controls">
          <button type="button" onClick={() => onMinimize(window.appId)} aria-label={`Minimize ${app.title}`}>
            <Minus aria-hidden="true" size={15} />
          </button>
          <button type="button" onClick={() => onToggleMaximize(window.appId)} aria-label={`${window.maximized ? "Restore" : "Maximize"} ${app.title}`}>
            <Maximize2 aria-hidden="true" size={14} />
          </button>
          <button type="button" onClick={() => onClose(window.appId)} aria-label={`Close ${app.title}`}>
            <X aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
      <nav className="os-window__menubar" aria-label={`${app.title} menu`}>
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">View</button>
        <button type="button">Help</button>
      </nav>
      <div className="os-window__content">{children}</div>
      <button
        className="os-window__resize"
        type="button"
        onPointerDown={handleResizePointerDown}
        aria-label={`Resize ${app.title}`}
      />
    </section>
  );
}
