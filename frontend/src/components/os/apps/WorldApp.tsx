import { Rocket, TerminalSquare } from "lucide-react";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function WorldApp({ runAction }: OsAppComponentProps) {
  const worldRoadmap = portfolioKernel.getWorldRoadmap();

  return (
    <div className="app-view app-view--world">
      <header className="app-hero">
        <span className="os-label">world.prototype</span>
        <h2>3D mode stays focused and small.</h2>
        <p>
          The current launch flow is a CSS spatial prototype. The next technical branch can replace
          it with React Three Fiber and Drei without disturbing the OS shell.
        </p>
      </header>
      <div className="roadmap-list">
        {worldRoadmap.map((item) => (
          <article key={item}>
            <TerminalSquare aria-hidden="true" size={18} />
            <span>{item}</span>
          </article>
        ))}
      </div>
      <button className="app-action" type="button" onClick={() => runAction(portfolioKernel.actions.launchWorld())}>
        <Rocket aria-hidden="true" size={17} />
        Run boot sequence
      </button>
    </div>
  );
}
