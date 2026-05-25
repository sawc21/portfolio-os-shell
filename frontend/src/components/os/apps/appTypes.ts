import type { KnownAppParams, SystemAction } from "../../../lib/types";

export type OsAppComponentProps = {
  runAction: (action: SystemAction) => void;
  params?: KnownAppParams;
};
