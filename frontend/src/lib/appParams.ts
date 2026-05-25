import type { AppParamsById } from "./types";

type UnknownRecord = Record<string, unknown>;

export function getSearchAppParams(params: unknown): AppParamsById["search"] {
  const record = asRecord(params);
  return typeof record?.query === "string" ? { query: record.query } : {};
}

export function getTerminalAppParams(params: unknown): AppParamsById["terminal"] {
  const record = asRecord(params);
  return typeof record?.command === "string" ? { command: record.command } : {};
}

export function getNotesAppParams(params: unknown): AppParamsById["notes"] {
  const record = asRecord(params);
  return {
    ...(typeof record?.noteId === "string" ? { noteId: record.noteId } : {}),
    ...(typeof record?.query === "string" ? { query: record.query } : {})
  };
}

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : null;
}
