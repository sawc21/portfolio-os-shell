import type { PointerEvent as ReactPointerEvent } from "react";
import type { AppDefinition } from "../../lib/types";

type PointerPoint = {
  clientX: number;
  clientY: number;
};

type DesktopIconProps = {
  app: AppDefinition;
  dragging: boolean;
  dropTarget: boolean;
  selected: boolean;
  onSelect: (appId: AppDefinition["id"]) => void;
  onDragStart: (appId: AppDefinition["id"]) => void;
  onDragMove: (appId: AppDefinition["id"], point: PointerPoint) => void;
  onDragEnd: (appId: AppDefinition["id"], point: PointerPoint) => void;
  onOpen: (appId: AppDefinition["id"]) => void;
  launchingWorld: boolean;
};

export function DesktopIcon({
  app,
  dragging,
  dropTarget,
  selected,
  onSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
  onOpen,
  launchingWorld
}: DesktopIconProps) {
  const Icon = app.icon;

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onSelect(app.id);

    const originX = event.clientX;
    const originY = event.clientY;
    let moved = false;
    let dragStarted = false;
    let lastPoint: PointerPoint = { clientX: event.clientX, clientY: event.clientY };

    event.currentTarget.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - originX;
      const deltaY = moveEvent.clientY - originY;
      lastPoint = { clientX: moveEvent.clientX, clientY: moveEvent.clientY };

      if (!moved && Math.hypot(deltaX, deltaY) > 6) {
        moved = true;
        dragStarted = true;
        onDragStart(app.id);
      }

      if (dragStarted) {
        onDragMove(app.id, lastPoint);
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (dragStarted) {
        onDragEnd(app.id, lastPoint);
        return;
      }

      if (!moved) {
        onSelect(app.id);
        onOpen(app.id);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  return (
    <button
      className="desktop-icon"
      data-launching={launchingWorld ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      data-drop-target={dropTarget ? "true" : "false"}
      style={{ "--app-accent": app.accent } as React.CSSProperties}
      type="button"
      onPointerDown={handlePointerDown}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(app.id);
        }
      }}
      aria-label={`${selected ? "Selected" : "Open"} ${app.title}. Click, press Enter, or press Space to open. Drag to move.`}
    >
      <span className="desktop-icon__glyph">
        <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
      </span>
      <span>{app.shortTitle}</span>
    </button>
  );
}
