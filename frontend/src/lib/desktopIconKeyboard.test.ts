import { describe, expect, test } from "vitest";
import { getNextDesktopIconIndex } from "./desktopIconKeyboard";

describe("desktop icon keyboard navigation", () => {
  test("moves horizontally and vertically through a fixed grid", () => {
    expect(getNextDesktopIconIndex({ currentIndex: 0, key: "ArrowRight", columns: 5, total: 12 })).toBe(1);
    expect(getNextDesktopIconIndex({ currentIndex: 4, key: "ArrowRight", columns: 5, total: 12 })).toBe(4);
    expect(getNextDesktopIconIndex({ currentIndex: 6, key: "ArrowLeft", columns: 5, total: 12 })).toBe(5);
    expect(getNextDesktopIconIndex({ currentIndex: 2, key: "ArrowDown", columns: 5, total: 12 })).toBe(7);
    expect(getNextDesktopIconIndex({ currentIndex: 9, key: "ArrowDown", columns: 5, total: 12 })).toBe(9);
    expect(getNextDesktopIconIndex({ currentIndex: 7, key: "ArrowUp", columns: 5, total: 12 })).toBe(2);
  });

  test("supports home and end within the current row", () => {
    expect(getNextDesktopIconIndex({ currentIndex: 7, key: "Home", columns: 5, total: 12 })).toBe(5);
    expect(getNextDesktopIconIndex({ currentIndex: 7, key: "End", columns: 5, total: 12 })).toBe(9);
    expect(getNextDesktopIconIndex({ currentIndex: 11, key: "End", columns: 5, total: 12 })).toBe(11);
  });
});
