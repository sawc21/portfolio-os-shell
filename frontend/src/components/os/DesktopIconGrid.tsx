import type { AppDefinition, DesktopIconPosition } from "../../lib/types";
import { DesktopIcon } from "./DesktopIcon";

type DesktopIconGridProps = {
  apps: AppDefinition[];
  positions: Partial<Record<AppDefinition["id"], DesktopIconPosition>>;
  selectedAppId: AppDefinition["id"] | null;
  launchingWorld: boolean;
  onSelect: (appId: AppDefinition["id"]) => void;
  onMove: (appId: AppDefinition["id"], position: DesktopIconPosition) => void;
  onOpen: (appId: AppDefinition["id"]) => void;
};

export function DesktopIconGrid({
  apps,
  positions,
  selectedAppId,
  launchingWorld,
  onSelect,
  onMove,
  onOpen
}: DesktopIconGridProps) {
  return (
    <div className="desktop-icons" aria-label="Desktop apps">
      {apps.map((app) => (
        <DesktopIcon
          key={app.id}
          app={app}
          position={positions[app.id]}
          selected={selectedAppId === app.id}
          onSelect={onSelect}
          onMove={onMove}
          onOpen={onOpen}
          launchingWorld={launchingWorld}
        />
      ))}
    </div>
  );
}
