import { getDesktopGridSlots, getSlotIndexFromPoint } from "../../lib/desktopIconLayout";
import { getNextDesktopIconIndex } from "../../lib/desktopIconKeyboard";
import type { AppDefinition } from "../../lib/types";
import { DesktopIcon } from "./DesktopIcon";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

type DesktopIconGridProps = {
  apps: AppDefinition[];
  selectedAppId: AppDefinition["id"] | null;
  launchingWorld: boolean;
  onSelect: (appId: AppDefinition["id"]) => void;
  onReorder: (appId: AppDefinition["id"], targetIndex: number) => void;
  onOpen: (appId: AppDefinition["id"]) => void;
};

type PointerPoint = {
  clientX: number;
  clientY: number;
};

export function DesktopIconGrid({
  apps,
  selectedAppId,
  launchingWorld,
  onSelect,
  onReorder,
  onOpen
}: DesktopIconGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [draggingAppId, setDraggingAppId] = useState<AppDefinition["id"] | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    setFocusedIndex((current) => Math.min(current, Math.max(apps.length - 1, 0)));
  }, [apps.length]);

  function getTargetIndex(point: PointerPoint) {
    const grid = gridRef.current;

    if (!grid) {
      return null;
    }

    const rect = grid.getBoundingClientRect();
    const metrics = getDesktopGridSlots(rect.width, rect.height);
    return getSlotIndexFromPoint(point.clientX - rect.left, point.clientY - rect.top, metrics, apps.length);
  }

  function handleDragMove(appId: AppDefinition["id"], point: PointerPoint) {
    const targetIndex = getTargetIndex(point);

    if (targetIndex === null) {
      return;
    }

    setDropIndex(targetIndex);
    onReorder(appId, targetIndex);
  }

  function handleDragEnd(appId: AppDefinition["id"], point: PointerPoint) {
    const targetIndex = getTargetIndex(point);

    if (targetIndex !== null) {
      onReorder(appId, targetIndex);
    }

    setDraggingAppId(null);
    setDropIndex(null);
  }

  function focusIcon(index: number) {
    const app = apps[index];
    if (!app) {
      return;
    }

    setFocusedIndex(index);
    onSelect(app.id);
    window.requestAnimationFrame(() => iconRefs.current[index]?.focus());
  }

  function handleIconFocus(appId: AppDefinition["id"]) {
    const index = apps.findIndex((app) => app.id === appId);
    if (index >= 0) {
      setFocusedIndex(index);
      onSelect(appId);
    }
  }

  function handleIconKeyNavigate(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    appId: AppDefinition["id"]
  ) {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    const grid = gridRef.current;
    const currentIndex = apps.findIndex((app) => app.id === appId);
    if (!grid || currentIndex < 0) {
      return;
    }

    const rect = grid.getBoundingClientRect();
    const metrics = getDesktopGridSlots(rect.width, rect.height);
    const nextIndex = getNextDesktopIconIndex({
      currentIndex,
      key: event.key,
      columns: metrics.columns,
      total: apps.length
    });

    event.preventDefault();
    focusIcon(nextIndex);
  }

  return (
    <div className="desktop-icons" aria-label="Desktop apps" ref={gridRef}>
      {apps.map((app, index) => (
        <DesktopIcon
          key={app.id}
          app={app}
          dragging={draggingAppId === app.id}
          dropTarget={dropIndex === index && draggingAppId !== app.id}
          selected={selectedAppId === app.id}
          onSelect={onSelect}
          onDragStart={setDraggingAppId}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onOpen={onOpen}
          launchingWorld={launchingWorld}
          buttonRef={(element) => {
            iconRefs.current[index] = element;
          }}
          tabIndex={index === focusedIndex ? 0 : -1}
          onFocus={handleIconFocus}
          onKeyNavigate={handleIconKeyNavigate}
        />
      ))}
    </div>
  );
}
