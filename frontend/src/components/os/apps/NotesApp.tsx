import {
  Eye,
  FilePlus2,
  LockKeyhole,
  RotateCcw,
  Search,
  Star,
  StarOff,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getNotesAppParams } from "../../../lib/appParams";
import {
  createPortfolioNote,
  deletePortfolioNote,
  parseNoteTags,
  portfolioNotesUpdatedEvent,
  readPortfolioNotes,
  renderNoteMarkdown,
  resetPortfolioNotes,
  setPortfolioNoteVisibility,
  togglePortfolioNoteFavorite,
  updatePortfolioNote,
  writePortfolioNotes
} from "../../../lib/portfolioNotes";
import type { KnownAppParams, PortfolioNote } from "../../../lib/types";

type NoteFilter = "all" | "favorites" | "public" | "private";

type NotesAppProps = {
  params?: KnownAppParams;
};

export function NotesApp({ params }: NotesAppProps) {
  const paramsState = getNotesAppParams(params);
  const [notes, setNotes] = useState<PortfolioNote[]>(() => readPortfolioNotes());
  const [activeId, setActiveId] = useState(() => paramsState.noteId ?? notes[0]?.id ?? "");
  const [query, setQuery] = useState(paramsState.query ?? "");
  const [activeTag, setActiveTag] = useState("all");
  const [filter, setFilter] = useState<NoteFilter>("all");

  useEffect(() => {
    writePortfolioNotes(notes, window.localStorage, null);
  }, [notes]);

  useEffect(() => {
    function refreshNotes() {
      setNotes(readPortfolioNotes());
    }

    window.addEventListener(portfolioNotesUpdatedEvent, refreshNotes);
    return () => window.removeEventListener(portfolioNotesUpdatedEvent, refreshNotes);
  }, []);

  useEffect(() => {
    if (paramsState.query !== undefined) {
      setQuery(paramsState.query);
    }

    if (paramsState.noteId !== undefined) {
      setActiveId(paramsState.noteId);
    }
  }, [paramsState.noteId, paramsState.query]);

  useEffect(() => {
    if (notes.length === 0) {
      setActiveId("");
      return;
    }

    if (!notes.some((note) => note.id === activeId)) {
      setActiveId(notes[0].id);
    }
  }, [activeId, notes]);

  const allTags = useMemo(
    () => Array.from(new Set(notes.flatMap((note) => note.tags))).sort((a, b) => a.localeCompare(b)),
    [notes]
  );

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesQuery = !normalizedQuery || [
        note.title,
        note.content,
        note.tags.join(" ")
      ].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesTag = activeTag === "all" || note.tags.includes(activeTag);
      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" && note.isFavorite) ||
        (filter === "public" && note.visibility === "public") ||
        (filter === "private" && note.visibility === "private");

      return matchesQuery && matchesTag && matchesFilter;
    });
  }, [activeTag, filter, notes, query]);

  const activeNote = notes.find((note) => note.id === activeId) ?? visibleNotes[0] ?? notes[0];
  const tagsInput = activeNote?.tags.join(", ") ?? "";
  const previewHtml = renderNoteMarkdown(activeNote?.content ?? "");

  function persist(nextNotes: PortfolioNote[], nextActiveId = activeId) {
    setNotes(nextNotes);
    setActiveId(nextActiveId);
  }

  function createNote() {
    const note = createPortfolioNote({
      title: "Untitled project note",
      content: "# Untitled project note\n\nCapture the workflow, system decision, or project insight here.",
      tags: ["systems", "draft"]
    });

    persist([note, ...notes], note.id);
  }

  function updateActiveNote(patch: Partial<Omit<PortfolioNote, "id" | "createdAtUtc">>) {
    if (!activeNote) {
      return;
    }

    persist(updatePortfolioNote(notes, activeNote.id, patch), activeNote.id);
  }

  function deleteActiveNote() {
    if (!activeNote) {
      return;
    }

    const nextNotes = deletePortfolioNote(notes, activeNote.id);
    persist(nextNotes, nextNotes[0]?.id ?? "");
  }

  function resetNotes() {
    const seededNotes = resetPortfolioNotes(window.localStorage, window);
    persist(seededNotes, seededNotes[0]?.id ?? "");
    setQuery("");
    setActiveTag("all");
    setFilter("all");
  }

  return (
    <div className="project-notes-app">
      <header className="app-hero project-notes-app__hero">
        <span className="os-label">project.notes</span>
        <h2>Research notebook for project thinking.</h2>
        <p>
          Local-first markdown notes for architecture ideas, workflow plans, migration plans,
          and portfolio-ready technical writeups.
        </p>
      </header>

      <section className="project-notes-workspace" aria-label="Project Notes workspace">
        <aside className="project-notes-sidebar">
          <div className="project-notes-toolbar">
            <button type="button" className="app-action" onClick={createNote}>
              <FilePlus2 aria-hidden="true" size={15} />
              New note
            </button>
            <button type="button" className="inline-action" onClick={resetNotes}>
              <RotateCcw aria-hidden="true" size={14} />
              Reset seeds
            </button>
          </div>

          <label className="project-notes-search">
            <Search aria-hidden="true" size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              aria-label="Search Project Notes"
            />
          </label>

          <div className="project-notes-filters" aria-label="Note filters">
            {(["all", "favorites", "public", "private"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "is-active" : undefined}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="project-notes-tags" aria-label="Tag filters">
            <button
              type="button"
              className={activeTag === "all" ? "is-active" : undefined}
              onClick={() => setActiveTag("all")}
            >
              all tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={activeTag === tag ? "is-active" : undefined}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="project-notes-list" aria-label="Notes">
            {visibleNotes.length > 0 ? visibleNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                className={activeNote?.id === note.id ? "is-active" : undefined}
                onClick={() => setActiveId(note.id)}
              >
                <span>
                  {note.isFavorite ? <Star aria-hidden="true" size={14} /> : <FilePlus2 aria-hidden="true" size={14} />}
                  {note.visibility}
                </span>
                <strong>{note.title}</strong>
                <small>{note.tags.slice(0, 3).join(" / ") || "untagged"}</small>
              </button>
            )) : (
              <p className="project-notes-empty">No notes match this filter.</p>
            )}
          </div>
        </aside>

        <main className="project-notes-editor">
          {activeNote ? (
            <>
              <div className="project-notes-editor__top">
                <input
                  value={activeNote.title}
                  onChange={(event) => updateActiveNote({ title: event.target.value })}
                  aria-label="Note title"
                />
                <div className="project-notes-editor__actions">
                  <button
                    type="button"
                    className="inline-action"
                    onClick={() => persist(togglePortfolioNoteFavorite(notes, activeNote.id), activeNote.id)}
                  >
                    {activeNote.isFavorite ? <StarOff aria-hidden="true" size={14} /> : <Star aria-hidden="true" size={14} />}
                    {activeNote.isFavorite ? "Unfavorite" : "Favorite"}
                  </button>
                  <button
                    type="button"
                    className="inline-action"
                    onClick={() => persist(
                      setPortfolioNoteVisibility(
                        notes,
                        activeNote.id,
                        activeNote.visibility === "public" ? "private" : "public"
                      ),
                      activeNote.id
                    )}
                  >
                    {activeNote.visibility === "public" ? <LockKeyhole aria-hidden="true" size={14} /> : <Eye aria-hidden="true" size={14} />}
                    Make {activeNote.visibility === "public" ? "private" : "public"}
                  </button>
                  <button type="button" className="inline-action" onClick={deleteActiveNote}>
                    <Trash2 aria-hidden="true" size={14} />
                    Delete
                  </button>
                </div>
              </div>

              <label className="project-notes-tag-input">
                Tags
                <input
                  value={tagsInput}
                  onChange={(event) => updateActiveNote({ tags: parseNoteTags(event.target.value) })}
                  aria-label="Note tags"
                  placeholder="systems, workflow, backend"
                />
              </label>

              <div className="project-notes-meta">
                <span data-visibility={activeNote.visibility}>
                  {activeNote.visibility === "public" ? "public draft" : "private draft"}
                </span>
                <span>updated {formatDate(activeNote.updatedAtUtc)}</span>
                {activeNote.slug ? <code>/notes/{activeNote.slug}</code> : null}
              </div>

              <div className="project-notes-compose">
                <label>
                  Markdown
                  <textarea
                    value={activeNote.content}
                    onChange={(event) => updateActiveNote({ content: event.target.value })}
                    aria-label="Note markdown"
                  />
                </label>
                <section className="project-notes-preview" aria-label="Markdown preview">
                  <span className="os-label">preview</span>
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </section>
              </div>
            </>
          ) : (
            <div className="project-notes-empty">
              <p>No notes available. Reset seeded notes or create a new draft.</p>
              <button type="button" className="app-action" onClick={createNote}>Create note</button>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
