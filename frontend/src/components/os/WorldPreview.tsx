import { ArrowLeft, FolderKanban, Mail, TerminalSquare } from "lucide-react";
import { bootLines } from "../../lib/mockData";

type WorldPreviewProps = {
  mode: "desktop" | "booting" | "world";
  onExitWorld: () => void;
};

export function WorldPreview({ mode, onExitWorld }: WorldPreviewProps) {
  if (mode === "desktop") {
    return null;
  }

  return (
    <section className="world-layer" data-mode={mode} aria-label="Portfolio world prototype">
      {mode === "booting" ? (
        <div className="boot-overlay">
          <span className="os-label">world.boot</span>
          <div className="boot-progress" aria-hidden="true">
            <span />
          </div>
          {bootLines.map((line, index) => (
            <p key={line} style={{ animationDelay: `${index * 420}ms` }}>
              {line}
            </p>
          ))}
        </div>
      ) : (
        <div className="world-preview">
          <button type="button" onClick={onExitWorld}>
            <ArrowLeft aria-hidden="true" size={16} />
            Return to desktop
          </button>
          <div className="world-island" aria-hidden="true">
            <span className="world-station world-station--projects">
              <FolderKanban size={28} />
            </span>
            <span className="world-station world-station--resume">
              <TerminalSquare size={28} />
            </span>
            <span className="world-station world-station--contact">
              <Mail size={28} />
            </span>
          </div>
          <aside>
            <span className="os-label">3d.prototype</span>
            <h2>Desktop becomes a physical workspace.</h2>
            <p>
              This lightweight prototype reserves the interaction model for the React Three Fiber scene:
              projects become portals, the resume becomes a terminal station, and contact becomes a signal tower.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
