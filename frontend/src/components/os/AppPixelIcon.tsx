import type { AppDefinition } from "../../lib/types";
import { appIconAssets } from "../../lib/appIconAssets";

type AppPixelIconProps = {
  app: AppDefinition;
  className?: string;
  fallbackSize: number;
};

export function AppPixelIcon({ app, className, fallbackSize }: AppPixelIconProps) {
  const Icon = app.icon;
  const asset = appIconAssets[app.id];

  if (asset) {
    return <img className={className} src={asset} alt="" aria-hidden="true" draggable={false} />;
  }

  return <Icon aria-hidden="true" className={className} size={fallbackSize} strokeWidth={1.8} />;
}
