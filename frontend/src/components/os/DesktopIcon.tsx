import type { AppDefinition } from "../../lib/types";

type DesktopIconProps = {
  app: AppDefinition;
  onOpen: (appId: AppDefinition["id"]) => void;
  launchingWorld: boolean;
};

export function DesktopIcon({ app, onOpen, launchingWorld }: DesktopIconProps) {
  const Icon = app.icon;

  return (
    <button
      className="desktop-icon"
      data-launching={launchingWorld ? "true" : "false"}
      style={{ "--app-accent": app.accent } as React.CSSProperties}
      type="button"
      onDoubleClick={() => onOpen(app.id)}
      onClick={() => onOpen(app.id)}
      aria-label={`Open ${app.title}`}
    >
      <span className="desktop-icon__glyph">
        <Icon aria-hidden="true" size={28} strokeWidth={1.8} />
      </span>
      <span>{app.shortTitle}</span>
    </button>
  );
}
