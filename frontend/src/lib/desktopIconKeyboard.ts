type DesktopIconNavigationInput = {
  currentIndex: number;
  key: string;
  columns: number;
  total: number;
};

export function getNextDesktopIconIndex({
  currentIndex,
  key,
  columns,
  total
}: DesktopIconNavigationInput) {
  if (total <= 0 || columns <= 0) {
    return 0;
  }

  const boundedIndex = Math.min(Math.max(currentIndex, 0), total - 1);
  const rowStart = Math.floor(boundedIndex / columns) * columns;
  const rowEnd = Math.min(rowStart + columns - 1, total - 1);

  switch (key) {
    case "ArrowRight":
      return Math.min(boundedIndex + 1, rowEnd);
    case "ArrowLeft":
      return Math.max(boundedIndex - 1, rowStart);
    case "ArrowDown":
      return boundedIndex + columns < total ? boundedIndex + columns : boundedIndex;
    case "ArrowUp":
      return boundedIndex - columns >= 0 ? boundedIndex - columns : boundedIndex;
    case "Home":
      return rowStart;
    case "End":
      return rowEnd;
    default:
      return boundedIndex;
  }
}
