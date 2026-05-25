import { useState } from "react";
import { portfolioKernel } from "../../../os/kernel/kernel";

export function HabitsApp() {
  const [habitData, setHabitData] = useState(() => portfolioKernel.getDeveloperHabitsData());

  return (
    <div className="app-view app-view--habits">
      <header className="app-hero">
        <span className="os-label">developer.habits</span>
        <h2>Consistency loops that support internship readiness.</h2>
      </header>
      <div className="habit-grid">
        {habitData.habits.map((habit) => (
          <article key={habit.title}>
            <strong>{habit.streak}</strong>
            <span>{habit.title}</span>
            <small>{habit.category} / {habit.cadence}</small>
            <button type="button" className="inline-action" onClick={() => setHabitData(portfolioKernel.toggleHabitCheckIn(habit.id))}>
              {habit.checkedToday ? "Checked in" : "Check in"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
