export const requiredAccessPhrase = "Hire Sawyer";
export const authGateStorageKey = "portfolio-os:auth-gate:v1";

export function isCorrectAccessPhrase(value: string) {
  return value === requiredAccessPhrase;
}

export function readAuthGateUnlocked(storage: Pick<Storage, "getItem">) {
  return storage.getItem(authGateStorageKey) === "unlocked";
}

export function writeAuthGateUnlocked(storage: Pick<Storage, "setItem">) {
  storage.setItem(authGateStorageKey, "unlocked");
}
