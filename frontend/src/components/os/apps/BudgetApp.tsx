import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { ScopeScenarioInput } from "../../../lib/types";
import { portfolioKernel } from "../../../os/kernel/kernel";

export function BudgetApp() {
  const [scope, setScope] = useState(() => portfolioKernel.getScopeBudgetData());
  const total = useMemo(() => scope.items.reduce((sum, item) => sum + item.value, 0), [scope.items]);
  const averageRecruiterValue = Math.round(
    scope.items.reduce((sum, item) => sum + item.recruiterValue, 0) / scope.items.length
  );

  function updateScenario(input: ScopeScenarioInput) {
    setScope(portfolioKernel.updateScopeScenario(input));
  }

  return (
    <div className="app-view app-view--budget">
      <header className="app-hero">
        <span className="os-label">scope.budget</span>
        <h2>Time, complexity, and recruiter value.</h2>
        <p>Mock planning data for portfolio tradeoffs. No personal finance is stored or requested.</p>
      </header>
      <div className="scope-controls">
        <label>
          Polish bias
          <input
            type="range"
            min="0"
            max="100"
            value={scope.scenario.polishBias}
            onChange={(event) => updateScenario({ ...scope.scenario, polishBias: Number(event.target.value) })}
          />
          <span>{scope.scenario.polishBias}%</span>
        </label>
        <label>
          3D bias
          <input
            type="range"
            min="0"
            max="100"
            value={scope.scenario.threeDBias}
            onChange={(event) => updateScenario({ ...scope.scenario, threeDBias: Number(event.target.value) })}
          />
          <span>{scope.scenario.threeDBias}%</span>
        </label>
      </div>
      <div className="budget-meter" aria-label={`Demo budget total ${total} dollars`}>
        {scope.items.map((slice) => (
          <span
            key={slice.label}
            style={{ width: `${(slice.value / total) * 100}%`, background: slice.color }}
          />
        ))}
      </div>
      <p className="app-metric">Average recruiter value: {averageRecruiterValue}/100</p>
      <div className="budget-list">
        {scope.items.map((slice) => (
          <div key={slice.label}>
            <span style={{ background: slice.color }} />
            <strong>{slice.label}</strong>
            <em>{slice.value} {slice.unit} / {slice.risk} risk</em>
          </div>
        ))}
      </div>
      <div className="roadmap-list">
        {scope.items.map((item) => (
          <article key={item.id}>
            <SlidersHorizontal aria-hidden="true" size={18} />
            <span>{item.tradeoff}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
