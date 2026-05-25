import type { PortfolioNote } from "./types";

export const portfolioNotesStorageKey = "portfolio-os:ai-notes:v1";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type NoteInput = {
  title?: string;
  content?: string;
  tags?: string[] | string;
  visibility?: PortfolioNote["visibility"];
};

type QuickCaptureInput = {
  title?: string;
  body?: string;
  tags?: string[] | string;
};

export const quickCaptureDefaultTitle = "Quick note";
export const quickCaptureDefaultTags = ["quick-capture", "ai-notes"];

const seedTimestamp = "2026-01-15T15:00:00.000Z";

export const seedPortfolioNotes: PortfolioNote[] = [
  {
    id: "seed-quickbooks-mcp",
    title: "QuickBooks MCP Integration Plan",
    content:
      "# QuickBooks MCP Integration Plan\n\nMap QuickBooks data into assistant-ready workflows with clear tool boundaries, review states, and audit-friendly outputs.\n\n- Identify safe read-only actions first\n- Keep mutation tools behind confirmation\n- Show generated reports as inspectable artifacts",
    tags: ["quickbooks", "mcp", "agents", "finance"],
    isFavorite: true,
    visibility: "public",
    slug: "quickbooks-mcp-integration-plan",
    createdAtUtc: seedTimestamp,
    updatedAtUtc: seedTimestamp
  },
  {
    id: "seed-invoiceflow",
    title: "InvoiceFlow Automation Notes",
    content:
      "# InvoiceFlow Automation Notes\n\nPrototype an invoice workflow that extracts structured data, validates totals, and routes exceptions to a human review queue.\n\n- OCR/input parsing\n- Approval states\n- Exportable accounting summary",
    tags: ["automation", "invoices", "workflow", "ai"],
    isFavorite: false,
    visibility: "private",
    createdAtUtc: seedTimestamp,
    updatedAtUtc: seedTimestamp
  },
  {
    id: "seed-portfolio-os",
    title: "Portfolio OS Architecture",
    content:
      "# Portfolio OS Architecture\n\nThe portfolio shell works like a small operating system: app registry, command routing, searchable evidence, and typed system actions.\n\n- React window manager\n- ASP.NET public routes\n- Kernel-style app facade",
    tags: ["portfolio", "architecture", "react", "asp.net"],
    isFavorite: true,
    visibility: "public",
    slug: "portfolio-os-architecture",
    createdAtUtc: seedTimestamp,
    updatedAtUtc: seedTimestamp
  },
  {
    id: "seed-agent-workflows",
    title: "AI Agent Workflow Ideas",
    content:
      "# AI Agent Workflow Ideas\n\nDesign agent tools around observable steps: gather context, propose plan, act through typed commands, and verify before claiming completion.\n\n- Context panels\n- Tool call timeline\n- Guardrail checklist",
    tags: ["ai", "agents", "ux", "guardrails"],
    isFavorite: false,
    visibility: "private",
    createdAtUtc: seedTimestamp,
    updatedAtUtc: seedTimestamp
  },
  {
    id: "seed-postgresql",
    title: "PostgreSQL Migration Notes",
    content:
      "# PostgreSQL Migration Notes\n\nStart with localStorage, graduate to SQLite for EF Core wiring, then move notes persistence to PostgreSQL once CRUD is stable.\n\n- Keep DTOs simple\n- Add migrations after UI settles\n- Use Docker for repeatable local setup",
    tags: ["postgresql", "ef core", "sqlite", "backend"],
    isFavorite: false,
    visibility: "private",
    createdAtUtc: seedTimestamp,
    updatedAtUtc: seedTimestamp
  }
];

export function parseNoteTags(value: string | string[] | undefined) {
  const rawTags = Array.isArray(value) ? value : (value ?? "").split(",");
  const seen = new Set<string>();

  return rawTags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      const normalized = tag.toLowerCase();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
}

export function createPortfolioNote(
  input: NoteInput = {},
  options: { id?: string; now?: string } = {}
): PortfolioNote {
  const now = options.now ?? new Date().toISOString();
  const title = input.title?.trim() || "Untitled note";
  const visibility = input.visibility ?? "private";
  const note: PortfolioNote = {
    id: options.id ?? createId(),
    title,
    content: input.content ?? "",
    tags: parseNoteTags(input.tags),
    isFavorite: false,
    visibility,
    createdAtUtc: now,
    updatedAtUtc: now
  };

  return visibility === "public" ? { ...note, slug: slugify(title) } : note;
}

export function createQuickCaptureNote(
  input: QuickCaptureInput = {},
  options: { id?: string; now?: string } = {}
) {
  const title = input.title?.trim() || quickCaptureDefaultTitle;
  const body = input.body?.trim() ?? "";
  const content = `# ${title}\n\n${body}`.trimEnd();

  return createPortfolioNote(
    {
      title,
      content,
      tags: input.tags ?? quickCaptureDefaultTags,
      visibility: "private"
    },
    options
  );
}

export function updatePortfolioNote(
  notes: PortfolioNote[],
  id: string,
  patch: Partial<Omit<PortfolioNote, "id" | "createdAtUtc">>,
  now = new Date().toISOString()
) {
  return notes.map((note) => {
    if (note.id !== id) {
      return note;
    }

    const next = {
      ...note,
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() || "Untitled note" : note.title,
      tags: patch.tags !== undefined ? parseNoteTags(patch.tags) : note.tags,
      updatedAtUtc: now
    };

    if (next.visibility === "public" && !next.slug) {
      next.slug = slugify(next.title);
    }

    if (next.visibility === "private") {
      delete next.slug;
    }

    return next;
  });
}

export function deletePortfolioNote(notes: PortfolioNote[], id: string) {
  return notes.filter((note) => note.id !== id);
}

export function togglePortfolioNoteFavorite(notes: PortfolioNote[], id: string, now = new Date().toISOString()) {
  return updatePortfolioNote(
    notes,
    id,
    { isFavorite: !notes.find((note) => note.id === id)?.isFavorite },
    now
  );
}

export function setPortfolioNoteVisibility(
  notes: PortfolioNote[],
  id: string,
  visibility: PortfolioNote["visibility"],
  now = new Date().toISOString()
) {
  const note = notes.find((item) => item.id === id);
  return updatePortfolioNote(
    notes,
    id,
    { visibility, slug: visibility === "public" ? slugify(note?.title ?? "untitled-note") : undefined },
    now
  );
}

export function readPortfolioNotes(storage: Pick<Storage, "getItem"> = window.localStorage) {
  const raw = storage.getItem(portfolioNotesStorageKey);
  if (!raw) {
    return cloneSeedNotes();
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isPortfolioNote)) {
      return cloneSeedNotes();
    }

    return parsed;
  } catch {
    return cloneSeedNotes();
  }
}

export function writePortfolioNotes(notes: PortfolioNote[], storage: Pick<Storage, "setItem"> = window.localStorage) {
  storage.setItem(portfolioNotesStorageKey, JSON.stringify(notes));
}

export function appendPortfolioNote(
  note: PortfolioNote,
  storage: Pick<Storage, "getItem" | "setItem"> = window.localStorage
) {
  const nextNotes = [note, ...readPortfolioNotes(storage)];
  writePortfolioNotes(nextNotes, storage);
  return nextNotes;
}

export function resetPortfolioNotes(storage: StorageLike = window.localStorage) {
  storage.removeItem(portfolioNotesStorageKey);
  return cloneSeedNotes();
}

export function renderNoteMarkdown(markdown: string) {
  const escaped = escapeHtml(markdown.trim());
  if (!escaped) {
    return "<p>Start writing to preview markdown here.</p>";
  }

  const lines = escaped.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h3>${formatInline(line.slice(2))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h4>${formatInline(line.slice(3))}</h4>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(line.slice(2))}</li>`);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    closeList();
    html.push(`<p>${formatInline(line)}</p>`);
  }

  closeList();
  return html.join("");

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }
}

function cloneSeedNotes() {
  return seedPortfolioNotes.map((note) => ({ ...note, tags: [...note.tags] }));
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "untitled-note";
}

function isPortfolioNote(value: unknown): value is PortfolioNote {
  if (!value || typeof value !== "object") {
    return false;
  }

  const note = value as Partial<PortfolioNote>;
  return (
    typeof note.id === "string" &&
    typeof note.title === "string" &&
    typeof note.content === "string" &&
    Array.isArray(note.tags) &&
    note.tags.every((tag) => typeof tag === "string") &&
    typeof note.isFavorite === "boolean" &&
    (note.visibility === "private" || note.visibility === "public") &&
    typeof note.createdAtUtc === "string" &&
    typeof note.updatedAtUtc === "string"
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInline(value: string) {
  return value
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
