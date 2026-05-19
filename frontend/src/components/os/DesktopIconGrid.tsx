import { getDesktopGridSlots, getSlotIndexFromPoint } from "../../lib/desktopIconLayout";
import type { AppDefinition } from "../../lib/types";
import { DesktopIcon } from "./DesktopIcon";
import { useState, useRef } from "react";

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
  const [draggingAppId, setDraggingAppId] = useState<AppDefinition["id"] | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

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
        />
      ))}
    </div>
  );
}
