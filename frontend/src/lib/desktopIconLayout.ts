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
  cellWidth: 160,
  cellHeight: 154,
  gapX: 38,
  gapY: 42,
  paddingLeft: 32,
  paddingTop: 38
};

export function getDesktopGridSlots(containerWidth: number, containerHeight: number): DesktopGridMetrics {
  const columns = getResponsiveColumnCount(containerWidth);
  const rowWidth = columns * gridDefaults.cellWidth + (columns - 1) * gridDefaults.gapX;
  const centeredPadding = Math.max(gridDefaults.paddingLeft, Math.floor((containerWidth - rowWidth) / 2));

  return {
    ...gridDefaults,
    paddingLeft: centeredPadding,
    columns,
    cellHeight: containerHeight < 580 ? 132 : gridDefaults.cellHeight
  };
}

function getResponsiveColumnCount(containerWidth: number) {
  if (containerWidth >= 980) {
    return 5;
  }

  if (containerWidth >= 760) {
    return 4;
  }

  if (containerWidth >= 641) {
    return 3;
  }

  return 2;
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
