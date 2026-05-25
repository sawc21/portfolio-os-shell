import { describe, expect, test } from "vitest";
import { getKeyboardWindowChange } from "./windowKeyboard";

describe("window keyboard helpers", () => {
  test("maps Ctrl+Arrow to movement deltas", () => {
    expect(getKeyboardWindowChange({ key: "ArrowRight", ctrlKey: true, shiftKey: false })).toEqual({
      kind: "move",
      deltaX: 20,
      deltaY: 0
    });
    expect(getKeyboardWindowChange({ key: "ArrowUp", ctrlKey: true, shiftKey: false })).toEqual({
      kind: "move",
      deltaX: 0,
      deltaY: -20
    });
  });

  test("maps Ctrl+Shift+Arrow to resize deltas", () => {
    expect(getKeyboardWindowChange({ key: "ArrowDown", ctrlKey: true, shiftKey: true })).toEqual({
      kind: "resize",
      deltaWidth: 0,
      deltaHeight: 20
    });
  });

  test("maps keyboard window commands", () => {
    expect(getKeyboardWindowChange({ key: "m", ctrlKey: true, shiftKey: false })).toEqual({ kind: "minimize" });
    expect(getKeyboardWindowChange({ key: "M", ctrlKey: true, shiftKey: true })).toEqual({ kind: "toggle-maximize" });
    expect(getKeyboardWindowChange({ key: "m", ctrlKey: false, shiftKey: false })).toBeNull();
  });
});
