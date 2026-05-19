import type { PointerEvent as ReactPointerEvent } from "react";
import type { AppDefinition, DesktopIconPosition } from "../../lib/types";

type DesktopIconProps = {
  app: AppDefinition;
  position?: DesktopIconPosition;
  selected: boolean;
  onSelect: (appId: AppDefinition["id"]) => void;
  onMove: (appId: AppDefinition["id"], position: DesktopIconPosition) => void;
  onOpen: (appId: AppDefinition["id"]) => void;
  launchingWorld: boolean;
};

export function DesktopIcon({
  app,
  position,
  selected,
  onSelect,
  onMove,
  onOpen,
  launchingWorld
}: DesktopIconProps) {
  const Icon = app.icon;
  const hasCustomPosition = Boolean(position);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onSelect(app.id);

    const originX = event.clientX;
    const originY = event.clientY;
    const startRect = event.currentTarget.getBoundingClientRect();
    const startX = position?.x ?? startRect.left;
    const startY = position?.y ?? startRect.top;
    let moved = false;

    event.currentTarget.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextX = startX + moveEvent.clientX - originX;
      const nextY = startY + moveEvent.clientY - originY;
      moved = Math.abs(nextX - startX) > 4 || Math.abs(nextY - startY) > 4;
      if (moved) {
        onMove(app.id, { x: Math.max(12, nextX), y: Math.max(12, nextY) });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
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
      data-positioned={hasCustomPosition ? "true" : "false"}
      style={
        hasCustomPosition
          ? ({
              "--app-accent": app.accent,
              left: position?.x,
              top: position?.y
            } as React.CSSProperties)
          : ({ "--app-accent": app.accent } as React.CSSProperties)
      }
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
