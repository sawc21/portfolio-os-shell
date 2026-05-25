import { describe, expect, test } from "vitest";
import {
  appendPortfolioNote,
  createQuickCaptureNote,
  createPortfolioNote,
  deletePortfolioNote,
  parseNoteTags,
  portfolioNotesUpdatedEvent,
  portfolioNotesStorageKey,
  readPortfolioNotes,
  resetPortfolioNotes,
  seedPortfolioNotes,
  setPortfolioNoteVisibility,
  togglePortfolioNoteFavorite,
  updatePortfolioNote,
  writePortfolioNotes
} from "./portfolioNotes";

function createMemoryStorage(initialValue?: string) {
  const values = new Map<string, string>();

  if (initialValue !== undefined) {
    values.set(portfolioNotesStorageKey, initialValue);
  }

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key)
  };
}

describe("portfolio notes helpers", () => {
  test("returns seeded notes when storage is empty", () => {
    expect(readPortfolioNotes(createMemoryStorage()).map((note) => note.title)).toEqual(
      seedPortfolioNotes.map((note) => note.title)
    );
  });

  test("ignores invalid stored JSON and restores seeded notes", () => {
    expect(readPortfolioNotes(createMemoryStorage("{bad json"))).toHaveLength(seedPortfolioNotes.length);
    expect(readPortfolioNotes(createMemoryStorage(JSON.stringify([{ title: "Missing fields" }])))).toHaveLength(seedPortfolioNotes.length);
  });

  test("writes and reads valid notes", () => {
    const storage = createMemoryStorage();
    const note = createPortfolioNote({ title: "Stored note" }, { id: "note-1", now: "2026-01-01T00:00:00.000Z" });

    writePortfolioNotes([note], storage);

    expect(readPortfolioNotes(storage)).toEqual([note]);
  });

  test("creates notes with stable injected id and timestamps", () => {
    const note = createPortfolioNote(
      { title: "  AI Note  ", content: "Body", tags: "ai, agents, ai", visibility: "public" },
      { id: "note-fixed", now: "2026-02-03T04:05:06.000Z" }
    );

    expect(note).toMatchObject({
      id: "note-fixed",
      title: "AI Note",
      content: "Body",
      tags: ["ai", "agents"],
      visibility: "public",
      slug: "ai-note",
      createdAtUtc: "2026-02-03T04:05:06.000Z",
      updatedAtUtc: "2026-02-03T04:05:06.000Z"
    });
  });

  test("creates quick capture notes as private notes with default tags", () => {
    const note = createQuickCaptureNote(
      { title: "  Quick browser thought  ", body: "Capture this later." },
      { id: "quick-1", now: "2026-03-04T05:06:07.000Z" }
    );

    expect(note).toMatchObject({
      id: "quick-1",
      title: "Quick browser thought",
      content: "# Quick browser thought\n\nCapture this later.",
      tags: ["quick-capture", "ai-notes"],
      visibility: "private",
      createdAtUtc: "2026-03-04T05:06:07.000Z",
      updatedAtUtc: "2026-03-04T05:06:07.000Z"
    });
    expect(note.slug).toBeUndefined();
  });

  test("updates note content and updated timestamp", () => {
    const note = createPortfolioNote({ title: "Original" }, { id: "note-1", now: "2026-01-01T00:00:00.000Z" });
    const updated = updatePortfolioNote([note], "note-1", { title: "Updated", content: "New body" }, "2026-01-02T00:00:00.000Z");

    expect(updated[0]).toMatchObject({
      title: "Updated",
      content: "New body",
      updatedAtUtc: "2026-01-02T00:00:00.000Z"
    });
  });

  test("deletes only the selected note", () => {
    const first = createPortfolioNote({ title: "First" }, { id: "first", now: "2026-01-01T00:00:00.000Z" });
    const second = createPortfolioNote({ title: "Second" }, { id: "second", now: "2026-01-01T00:00:00.000Z" });

    expect(deletePortfolioNote([first, second], "first")).toEqual([second]);
  });

  test("appends to empty storage by prepending before seeded notes", () => {
    const storage = createMemoryStorage();
    const note = createQuickCaptureNote({ title: "Captured idea" }, { id: "quick-1", now: "2026-01-01T00:00:00.000Z" });

    const nextNotes = appendPortfolioNote(note, storage);

    expect(nextNotes[0]).toEqual(note);
    expect(nextNotes).toHaveLength(seedPortfolioNotes.length + 1);
    expect(readPortfolioNotes(storage)[0]).toEqual(note);
  });

  test("appends to existing storage without dropping existing notes", () => {
    const storage = createMemoryStorage();
    const existing = createPortfolioNote({ title: "Existing" }, { id: "existing", now: "2026-01-01T00:00:00.000Z" });
    const next = createQuickCaptureNote({ title: "New quick note" }, { id: "quick-1", now: "2026-01-02T00:00:00.000Z" });
    writePortfolioNotes([existing], storage);

    expect(appendPortfolioNote(next, storage)).toEqual([next, existing]);
  });

  test("dispatches a notes update event when appending notes", () => {
    const storage = createMemoryStorage();
    const target = new EventTarget();
    let eventCount = 0;
    target.addEventListener(portfolioNotesUpdatedEvent, () => {
      eventCount += 1;
    });

    appendPortfolioNote(
      createPortfolioNote({ title: "Captured" }, { id: "captured-note" }),
      storage,
      target
    );

    expect(eventCount).toBe(1);
  });

  test("toggles favorite state", () => {
    const note = createPortfolioNote({ title: "Favorite" }, { id: "note-1", now: "2026-01-01T00:00:00.000Z" });

    expect(togglePortfolioNoteFavorite([note], "note-1", "2026-01-02T00:00:00.000Z")[0].isFavorite).toBe(true);
  });

  test("toggles visibility and slug behavior", () => {
    const note = createPortfolioNote({ title: "Public Slug" }, { id: "note-1", now: "2026-01-01T00:00:00.000Z" });
    const publicNotes = setPortfolioNoteVisibility([note], "note-1", "public", "2026-01-02T00:00:00.000Z");
    const privateNotes = setPortfolioNoteVisibility(publicNotes, "note-1", "private", "2026-01-03T00:00:00.000Z");

    expect(publicNotes[0]).toMatchObject({ visibility: "public", slug: "public-slug" });
    expect(privateNotes[0].visibility).toBe("private");
    expect(privateNotes[0].slug).toBeUndefined();
  });

  test("parses tags by trimming blanks and removing duplicates", () => {
    expect(parseNoteTags(" ai, , Agents, ai, backend ")).toEqual(["ai", "Agents", "backend"]);
  });

  test("reset removes storage and returns seeded notes", () => {
    const storage = createMemoryStorage("[]");

    expect(resetPortfolioNotes(storage)).toHaveLength(seedPortfolioNotes.length);
    expect(storage.getItem(portfolioNotesStorageKey)).toBeNull();
  });
});
