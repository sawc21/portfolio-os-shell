import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { getSearchAppParams } from "../../../lib/appParams";
import type { SystemAction } from "../../../lib/types";
import { portfolioKernel } from "../../../os/kernel/kernel";
import type { OsAppComponentProps } from "./appTypes";

export function SearchApp({ runAction, params }: OsAppComponentProps) {
  const initialQuery = getSearchAppParams(params).query ?? "hire sawyer";
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => portfolioKernel.search(query), [query]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function handleResultAction(action: SystemAction) {
    if (action.type === "open-search") {
      setQuery(action.query);
      return;
    }
    runAction(action);
  }

  return (
    <div className="app-view app-view--search">
      <header className="app-hero">
        <span className="os-label">kernel.search</span>
        <h2>Sawyer Search</h2>
        <p>Search apps, projects, skills, commands, case studies, and hiring signals.</p>
      </header>
      <label className="search-box">
        <Search aria-hidden="true" size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search the Portfolio OS"
          placeholder="try ai, agents, hire sawyer, react"
        />
      </label>
      <div className="search-results">
        {results.map((result, index) => (
          <motion.button
            key={result.id}
            type="button"
            onClick={() => handleResultAction(result.action)}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: Math.min(index, 5) * 0.025 }}
          >
            <span>{result.category}</span>
            <strong>{result.title}</strong>
            <p>{result.description}</p>
            <small>{result.keywords.slice(0, 5).join(" / ")}</small>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
