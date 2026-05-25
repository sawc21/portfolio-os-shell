type KeyboardWindowInput = {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
};

export type KeyboardWindowChange =
  | { kind: "move"; deltaX: number; deltaY: number }
  | { kind: "resize"; deltaWidth: number; deltaHeight: number }
  | { kind: "minimize" }
  | { kind: "toggle-maximize" };

const keyboardStep = 20;

export function getKeyboardWindowChange({
  key,
  ctrlKey,
  shiftKey
}: KeyboardWindowInput): KeyboardWindowChange | null {
  if (!ctrlKey) {
    return null;
  }

  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "m") {
    return shiftKey ? { kind: "toggle-maximize" } : { kind: "minimize" };
  }

  const arrowDelta = getArrowDelta(key);
  if (!arrowDelta) {
    return null;
  }

  if (shiftKey) {
    return {
      kind: "resize",
      deltaWidth: arrowDelta.deltaX,
      deltaHeight: arrowDelta.deltaY
    };
  }

  return {
    kind: "move",
    deltaX: arrowDelta.deltaX,
    deltaY: arrowDelta.deltaY
  };
}

function getArrowDelta(key: string) {
  switch (key) {
    case "ArrowRight":
      return { deltaX: keyboardStep, deltaY: 0 };
    case "ArrowLeft":
      return { deltaX: -keyboardStep, deltaY: 0 };
    case "ArrowDown":
      return { deltaX: 0, deltaY: keyboardStep };
    case "ArrowUp":
      return { deltaX: 0, deltaY: -keyboardStep };
    default:
      return null;
  }
}
