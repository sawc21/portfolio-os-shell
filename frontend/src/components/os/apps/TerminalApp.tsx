import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { getTerminalAppParams } from "../../../lib/appParams";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function TerminalApp({ runAction, params }: OsAppComponentProps) {
  const [lines, setLines] = useState<string[]>([
    "Portfolio OS terminal online.",
    "Type help to list commands."
  ]);
  const [command, setCommand] = useState("");
  const commandParam = getTerminalAppParams(params).command ?? "";

  useEffect(() => {
    if (commandParam) {
      executeCommand(commandParam);
    }
  }, [commandParam]);

  function executeCommand(input = command) {
    const promptLine = `> ${input || "help"}`;
    const action = portfolioKernel.runCommand(input);

    if (action.type === "clear") {
      setLines([]);
      setCommand("");
      return;
    }

    if (action.type === "open-search") {
      runAction(action);
      const results = portfolioKernel.search(action.query);
      setLines((current) => [
        ...current,
        promptLine,
        `Searching for ${action.query}...`,
        ...results.slice(0, 4).map((result) => `${result.category}: ${result.title}`)
      ]);
      setCommand("");
      return;
    }

    if (action.type !== "print") {
      runAction(action);
      const announcement = portfolioKernel.describeAction(action);
      setLines((current) => announcement ? [...current, promptLine, announcement] : [...current, promptLine]);
      setCommand("");
      return;
    }

    setLines((current) => [...current, promptLine, ...action.lines]);
    setCommand("");
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeCommand();
  }

  function handleCommandKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    executeCommand();
  }

  return (
    <div className="terminal-app" role="application" aria-label="Portfolio OS terminal">
      <div className="terminal-output" aria-live="polite">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="terminal-line"
            style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
          >
            {line}
          </p>
        ))}
      </div>
      <form onSubmit={submitCommand}>
        <span>&gt;</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={handleCommandKeyDown}
          aria-label="Terminal command"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
