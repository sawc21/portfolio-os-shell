import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export function getNextFocusableIndex({
  currentIndex,
  direction,
  total
}: {
  currentIndex: number;
  direction: 1 | -1;
  total: number;
}) {
  if (total <= 0) {
    return 0;
  }

  return (currentIndex + direction + total) % total;
}

export function trapTabKey(event: ReactKeyboardEvent<HTMLElement>, container: HTMLElement | null) {
  if (event.key !== "Tab" || !container) {
    return;
  }

  const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => element.offsetParent !== null || element === document.activeElement);

  if (focusable.length === 0) {
    return;
  }

  const currentIndex = Math.max(0, focusable.indexOf(document.activeElement as HTMLElement));
  const nextIndex = getNextFocusableIndex({
    currentIndex,
    direction: event.shiftKey ? -1 : 1,
    total: focusable.length
  });

  event.preventDefault();
  focusable[nextIndex].focus();
}
