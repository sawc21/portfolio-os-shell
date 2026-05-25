import { describe, expect, test } from "vitest";
import { getNextFocusableIndex } from "./focusTrap";

describe("focus trap helpers", () => {
  test("cycles focus forward and backward", () => {
    expect(getNextFocusableIndex({ currentIndex: 0, direction: 1, total: 3 })).toBe(1);
    expect(getNextFocusableIndex({ currentIndex: 2, direction: 1, total: 3 })).toBe(0);
    expect(getNextFocusableIndex({ currentIndex: 0, direction: -1, total: 3 })).toBe(2);
  });

  test("returns zero when there are no focusable targets", () => {
    expect(getNextFocusableIndex({ currentIndex: 4, direction: 1, total: 0 })).toBe(0);
  });
});
