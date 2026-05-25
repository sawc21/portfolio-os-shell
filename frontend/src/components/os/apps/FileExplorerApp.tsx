import { Copy, FileCode2, Folder } from "lucide-react";
import { useState } from "react";
import type { FileSystemEntry } from "../../../lib/types";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function FileExplorerApp({ runAction }: OsAppComponentProps) {
  const entries = portfolioKernel.getFileSystemEntries();
  const directories = Array.from(new Set(entries.map((entry) => entry.directory)));
  const [activeDirectory, setActiveDirectory] = useState(directories[0] ?? "");
  const [selectedEntry, setSelectedEntry] = useState<FileSystemEntry | null>(entries[0] ?? null);
  const visibleEntries = entries.filter((entry) => entry.directory === activeDirectory);

  function openEntry(entry: FileSystemEntry) {
    setSelectedEntry(entry);
    runAction(portfolioKernel.getFileSystemEntryAction(entry));
  }

  return (
    <div className="file-explorer">
      <nav className="file-explorer__menubar" aria-label="File Explorer menu">
        <button type="button">File</button>
        <button type="button">Edit</button>
        <button type="button">View</button>
        <button type="button">Favorites</button>
        <button type="button">Tools</button>
        <button type="button">Help</button>
      </nav>
      <header className="file-explorer__toolbar">
        <button type="button" aria-label="Back">Back</button>
        <button type="button" aria-label="Forward">Forward</button>
        <button type="button" onClick={() => runAction(portfolioKernel.actions.openApp("search"))}>Search</button>
        <button type="button" onClick={() => runAction(portfolioKernel.actions.focusApp("files"))}>Folders</button>
        <label>
          Address
          <input value={activeDirectory} onChange={(event) => setActiveDirectory(event.target.value)} />
        </label>
      </header>
      <div className="file-explorer__body">
        <aside className="file-explorer__tree" aria-label="Portfolio directories">
          {directories.map((directory) => (
            <button
              key={directory}
              type="button"
              className={directory === activeDirectory ? "is-active" : undefined}
              onClick={() => setActiveDirectory(directory)}
            >
              <Folder aria-hidden="true" size={16} />
              <span>{directory}</span>
            </button>
          ))}
        </aside>
        <section className="file-explorer__files" aria-label="Directory contents">
          <div className="file-explorer__head">
            <span>Name</span>
            <span>Type</span>
            <span>Directory</span>
          </div>
          {visibleEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={selectedEntry?.id === entry.id ? "is-selected" : undefined}
              onClick={() => openEntry(entry)}
            >
              <span className="file-explorer__name">
                {entry.kind === "source" ? <FileCode2 aria-hidden="true" size={18} /> : <Folder aria-hidden="true" size={18} />}
                <strong>{entry.name}</strong>
              </span>
              <span>{entry.kind}</span>
              <small>{entry.directory}</small>
            </button>
          ))}
        </section>
      </div>
      <footer className="file-explorer__details">
        {selectedEntry ? (
          <>
            <strong>{selectedEntry.name}</strong>
            <span>{selectedEntry.description}</span>
            <code>{selectedEntry.sourcePath ?? selectedEntry.href ?? selectedEntry.directory}</code>
            {selectedEntry.sourcePath ? (
              <button
                type="button"
                onClick={() => runAction(portfolioKernel.actions.copyText(selectedEntry.sourcePath ?? "", selectedEntry.name))}
              >
                <Copy aria-hidden="true" size={14} />
                Copy source path
              </button>
            ) : null}
          </>
        ) : (
          <span>Select a file to inspect its path and action.</span>
        )}
      </footer>
    </div>
  );
}
