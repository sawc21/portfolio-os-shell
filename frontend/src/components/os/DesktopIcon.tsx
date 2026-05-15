import type { PointerEvent as ReactPointerEvent } from "react";
import type { AppDefinition, DesktopIconPosition } from "../../lib/types";

type DesktopIconProps = {
  app: AppDefinition;
  index: number;
  position?: DesktopIconPosition;
  selected: boolean;
  onSelect: (appId: AppDefinition["id"]) => void;
  onMove: (appId: AppDefinition["id"], position: DesktopIconPosition) => void;
  onOpen: (appId: AppDefinition["id"]) => void;
  launchingWorld: boolean;
};

export function DesktopIcon({
  app,
  index,
  position,
  selected,
  onSelect,
  onMove,
  onOpen,
  launchingWorld
}: DesktopIconProps) {
  const Icon = app.icon;
  const resolvedPosition = position ?? defaultIconPosition(index);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onSelect(app.id);

    const originX = event.clientX;
    const originY = event.clientY;
    const startX = resolvedPosition.x;
    const startY = resolvedPosition.y;
    let moved = false;

    event.currentTarget.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextX = startX + moveEvent.clientX - originX;
      const nextY = startY + moveEvent.clientY - originY;
      moved = Math.abs(nextX - startX) > 4 || Math.abs(nextY - startY) > 4;
      onMove(app.id, { x: Math.max(12, nextX), y: Math.max(12, nextY) });
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (!moved) {
        onSelect(app.id);
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
      style={
        {
          "--app-accent": app.accent,
          left: resolvedPosition.x,
          top: resolvedPosition.y
        } as React.CSSProperties
      }
      type="button"
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onOpen(app.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onOpen(app.id);
        }
      }}
      aria-label={`${selected ? "Selected" : "Select"} ${app.title}. Press Enter or double-click to open.`}
    >
      <span className="desktop-icon__glyph">
        <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
      </span>
      <span>{app.shortTitle}</span>
    </button>
  );
}

function defaultIconPosition(index: number): DesktopIconPosition {
  const column = index % 2;
  const row = Math.floor(index / 2);

  return {
    x: 24 + column * 110,
    y: 24 + row * 112
  };
}
