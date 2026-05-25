import { describe, expect, test } from "vitest";
import {
  authGateStorageKey,
  isCorrectAccessPhrase,
  readAuthGateUnlocked,
  requiredAccessPhrase,
  writeAuthGateUnlocked
} from "./usePortfolioAuthGate";

function createMemoryStorage(initialValue?: string) {
  const values = new Map<string, string>();

  if (initialValue !== undefined) {
    values.set(authGateStorageKey, initialValue);
  }

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value)
  };
}

describe("portfolio auth gate helpers", () => {
  test("accepts the exact access phrase", () => {
    expect(isCorrectAccessPhrase(requiredAccessPhrase)).toBe(true);
  });

  test("rejects wrong casing and empty input", () => {
    expect(isCorrectAccessPhrase("hire sawyer")).toBe(false);
    expect(isCorrectAccessPhrase("")).toBe(false);
  });

  test("reads unlocked session state", () => {
    expect(readAuthGateUnlocked(createMemoryStorage("unlocked"))).toBe(true);
    expect(readAuthGateUnlocked(createMemoryStorage("locked"))).toBe(false);
    expect(readAuthGateUnlocked(createMemoryStorage())).toBe(false);
  });

  test("writes unlocked session state", () => {
    const storage = createMemoryStorage();

    writeAuthGateUnlocked(storage);

    expect(storage.getItem(authGateStorageKey)).toBe("unlocked");
  });
});
