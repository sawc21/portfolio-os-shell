import { FileText, FolderOpen, Save, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { trapTabKey } from "../../lib/focusTrap";
import {
  appendPortfolioNote,
  createQuickCaptureNote,
  quickCaptureDefaultTags,
  quickCaptureDefaultTitle
} from "../../lib/portfolioNotes";

type QuickNoteProps = {
  open: boolean;
  onClose: () => void;
  onOpenNotes: (noteId?: string) => void;
};

type SaveStatus = "idle" | "error" | "saved";

export function QuickNote({ open, onClose, onOpenNotes }: QuickNoteProps) {
  const [title, setTitle] = useState(quickCaptureDefaultTitle);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState(quickCaptureDefaultTags.join(", "));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedNoteId, setSavedNoteId] = useState<string | undefined>();
  const dialogRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(quickCaptureDefaultTitle);
    setBody("");
    setTags(quickCaptureDefaultTags.join(", "));
    setStatus("idle");
    setSavedNoteId(undefined);
    window.setTimeout(() => bodyRef.current?.focus(), 0);
  }, [open]);

  if (!open) {
    return null;
  }

  function saveQuickNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    const hasMeaningfulTitle = trimmedTitle.length > 0 && trimmedTitle.toLowerCase() !== quickCaptureDefaultTitle.toLowerCase();
    if (!trimmedBody && !hasMeaningfulTitle) {
      setStatus("error");
      bodyRef.current?.focus();
      return;
    }

    const note = createQuickCaptureNote({
      title: trimmedTitle || quickCaptureDefaultTitle,
      body: trimmedBody,
      tags
    });
    appendPortfolioNote(note, window.localStorage, window);
    setSavedNoteId(note.id);
    setStatus("saved");
  }

  function openNotes() {
    onOpenNotes(savedNoteId);
    onClose();
  }

  return (
    <div className="quick-note-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="quick-note"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-note-title"
        aria-describedby="quick-note-status"
        onKeyDown={(event) => trapTabKey(event, dialogRef.current)}
      >
        <header className="quick-note__titlebar">
          <span>
            <FileText aria-hidden="true" size={16} />
            Quick Note
          </span>
          <button type="button" aria-label="Close Quick Note" onClick={onClose}>
            <X aria-hidden="true" size={15} />
          </button>
        </header>
        <form className="quick-note__body" onSubmit={saveQuickNote}>
          <div>
            <span className="os-label">Ctrl+Alt+N capture</span>
            <h2 id="quick-note-title">Save one thought to Project Notes.</h2>
            <p>Use this for a fast idea, task, or project note. Organize it later in the full Project Notes app.</p>
          </div>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setStatus("idle");
              }}
              aria-label="Quick note title"
            />
          </label>
          <label>
            Note
            <textarea
              ref={bodyRef}
              value={body}
              onChange={(event) => {
                setBody(event.target.value);
                setStatus("idle");
              }}
              aria-label="Quick note body"
              placeholder="Capture the thought before it gets lost..."
            />
          </label>
          <label>
            Tags
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              aria-label="Quick note tags"
            />
          </label>
          <p
            id="quick-note-status"
            className="quick-note__status"
            data-status={status}
            role={status === "error" ? "alert" : "status"}
          >
            {status === "error"
              ? "Add a title or note before saving."
              : status === "saved"
                ? "Saved to Project Notes."
                : "Saved notes are private until you publish them in Project Notes."}
          </p>
          <footer className="quick-note__actions">
            <button type="submit" className="app-action">
              <Save aria-hidden="true" size={15} />
              Save to Project Notes
            </button>
            <button type="button" className="inline-action" onClick={openNotes}>
              <FolderOpen aria-hidden="true" size={15} />
              Open Project Notes
            </button>
            <button type="button" className="inline-action" onClick={onClose}>
              Cancel
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
