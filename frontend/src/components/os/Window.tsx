import { Maximize2, Minus, X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { getAppDefinition } from "../../lib/appRegistry";
import type { AppId, WindowInstance } from "../../lib/types";

type WindowProps = {
  window: WindowInstance;
  focused: boolean;
  children: ReactNode;
  onFocus: (appId: AppId) => void;
  onClose: (appId: AppId) => void;
  onMinimize: (appId: AppId) => void;
  onMove: (appId: AppId, x: number, y: number) => void;
};

export function Window({
  window,
  focused,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMove
}: WindowProps) {
  const app = getAppDefinition(window.appId);
  const Icon = app.icon;

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) {
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

  if (window.minimized) {
    return null;
  }

  return (
    <section
      className="os-window"
      data-focused={focused ? "true" : "false"}
      style={
        {
          "--app-accent": app.accent,
          left: window.x,
          top: window.y,
          width: window.width,
          height: window.height,
          zIndex: window.zIndex
        } as React.CSSProperties
      }
      aria-label={`${app.title} window`}
      onPointerDown={() => onFocus(window.appId)}
    >
      <div className="os-window__titlebar" onPointerDown={handlePointerDown}>
        <div className="os-window__title">
          <Icon aria-hidden="true" size={17} />
          <span>{app.title}</span>
        </div>
        <div className="os-window__controls">
          <button type="button" onClick={() => onMinimize(window.appId)} aria-label={`Minimize ${app.title}`}>
            <Minus aria-hidden="true" size={15} />
          </button>
          <button type="button" aria-label={`${app.title} stays windowed`}>
            <Maximize2 aria-hidden="true" size={14} />
          </button>
          <button type="button" onClick={() => onClose(window.appId)} aria-label={`Close ${app.title}`}>
            <X aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
      <div className="os-window__content">{children}</div>
    </section>
  );
}
