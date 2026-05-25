import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { portfolioKernel } from "../../../os/kernel/kernel";

export function PlannerApp() {
  const [planner, setPlanner] = useState(() => portfolioKernel.getSprintPlannerData());

  return (
    <div className="app-view app-view--planner">
      <header className="app-hero">
        <span className="os-label">sprint.planner</span>
        <h2>{planner.currentSprint}</h2>
        <p>{planner.sprintGoal}</p>
      </header>
      <div className="token-row">
        {planner.roadmap.map((phase) => (
          <span key={phase}>{phase}</span>
        ))}
      </div>
      <div className="task-list">
        {planner.tasks.map((task) => (
          <article key={task.title} data-status={task.status}>
            {task.status === "done" ? <CheckCircle2 aria-hidden="true" size={18} /> : <Circle aria-hidden="true" size={18} />}
            <div>
              <strong>{task.title}</strong>
              <span>{task.area} / {task.status} / {task.tags.join(", ")}</span>
            </div>
            <button
              type="button"
              className="inline-action"
              onClick={() => setPlanner(portfolioKernel.updateSprintTaskStatus(task.id, nextTaskStatus(task.status)))}
            >
              Move to {nextTaskStatus(task.status)}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function nextTaskStatus(status: "queued" | "active" | "done") {
  if (status === "queued") {
    return "active";
  }

  if (status === "active") {
    return "done";
  }

  return "queued";
}
