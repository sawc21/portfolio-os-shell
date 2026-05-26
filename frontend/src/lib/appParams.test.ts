import { describe, expect, test } from "vitest";
import { getNotesAppParams, getSearchAppParams, getTerminalAppParams } from "./appParams";

describe("app params helpers", () => {
  test("accepts only valid search params", () => {
    expect(getSearchAppParams({ query: "workflows" })).toEqual({ query: "workflows" });
    expect(getSearchAppParams({ command: "help" })).toEqual({});
    expect(getSearchAppParams(null)).toEqual({});
  });

  test("accepts only valid terminal params", () => {
    expect(getTerminalAppParams({ command: "apps" })).toEqual({ command: "apps" });
    expect(getTerminalAppParams({ query: "apps" })).toEqual({});
  });

  test("accepts only valid notes params", () => {
    expect(getNotesAppParams({ noteId: "note-1", query: "quick" })).toEqual({
      noteId: "note-1",
      query: "quick"
    });
    expect(getNotesAppParams({ noteId: 42, query: false })).toEqual({});
  });
});
