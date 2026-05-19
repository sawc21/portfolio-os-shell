import type { AppId } from "./types";

export type DesktopGridMetrics = {
  columns: number;
  cellWidth: number;
  cellHeight: number;
  gapX: number;
  gapY: number;
  paddingLeft: number;
  paddingTop: number;
};

const gridDefaults = {
  cellWidth: 104,
  cellHeight: 108,
  gapX: 20,
  gapY: 18,
  paddingLeft: 24,
  paddingTop: 28
};

export function getDesktopGridSlots(containerWidth: number, containerHeight: number): DesktopGridMetrics {
  const usableWidth = Math.max(gridDefaults.cellWidth, containerWidth - gridDefaults.paddingLeft * 2);
  const columns = Math.max(
    1,
    Math.floor((usableWidth + gridDefaults.gapX) / (gridDefaults.cellWidth + gridDefaults.gapX))
  );

  return {
    ...gridDefaults,
    columns,
    cellHeight: containerHeight < 520 ? 96 : gridDefaults.cellHeight
  };
}

export function getSlotIndexFromPoint(
  x: number,
  y: number,
  grid: DesktopGridMetrics,
  itemCount: number
) {
  const col = Math.max(
    0,
    Math.min(grid.columns - 1, Math.floor((x - grid.paddingLeft) / (grid.cellWidth + grid.gapX)))
  );
  const row = Math.max(0, Math.floor((y - grid.paddingTop) / (grid.cellHeight + grid.gapY)));
  return Math.max(0, Math.min(itemCount - 1, row * grid.columns + col));
}

export function moveIconInOrder(order: AppId[], draggedId: AppId, targetIndex: number) {
  const currentIndex = order.indexOf(draggedId);

  if (currentIndex === -1) {
    return order;
  }

  const nextOrder = order.filter((appId) => appId !== draggedId);
  nextOrder.splice(Math.max(0, Math.min(targetIndex, nextOrder.length)), 0, draggedId);
  return nextOrder;
}

export function normalizeDesktopIconOrder(storedOrder: AppId[], availableIds: AppId[]) {
  const available = new Set(availableIds);
  const restored = storedOrder.filter((appId) => available.has(appId));
  const missing = availableIds.filter((appId) => !restored.includes(appId));
  return [...restored, ...missing];
}
