# Portfolio Operating System

This portfolio is an ASP.NET Core Razor Pages site with a modern React/TypeScript client mounted as the full-screen homepage. The main experience is a fake desktop operating system: visitors open apps, drag icons, manage windows, use a terminal, inspect portfolio content, and launch a lightweight world-mode prototype.

## Internship Portfolio Value

- **Full-stack foundation:** ASP.NET Core keeps public routes, Markdown content, RSS, sitemap, and route tests stable.
- **Frontend architecture:** React components are split into OS shell, window management, app registry, Portfolio Kernel, data providers, search, and terminal commands.
- **Interaction design:** The homepage behaves like an operating system with taskbar state, launcher search, draggable desktop icons, draggable/resizable windows, minimized apps, and keyboard escape handling.
- **Creative technology path:** The Launch World flow currently uses a boot overlay and CSS spatial prototype, leaving a clear next phase for React Three Fiber and Drei.

## Current Stack

- ASP.NET Core Razor Pages and xUnit route tests.
- Vite, React, TypeScript, Motion, and Lucide icons.
- Custom CSS for the OS design system and responsive desktop/mobile behavior.
- Mock data powers Sprint Planner, Scope Budget, and Developer Habits, with provider interfaces ready for later API-backed data.

## Architecture Notes

- The Razor homepage is intentionally thin: it provides metadata, a no-JS fallback, and the React mount.
- Traditional pages remain available as stable direct-link and SEO fallbacks, but primary navigation now lives inside the OS.
- Apps are registered in a single app registry with ids, icons, tags, command aliases, launcher visibility, desktop visibility, and default window geometry.
- The Portfolio Kernel centralizes app lookup, command routing, Sawyer Search, recruiter profile data, portfolio signals, and provider-backed app data.
- App content is data-driven through mock/provider files so the window manager stays focused on shell behavior.
- Local storage stores desktop icon positions and the current window session; Reset OS clears back to the curated default layout.

## Portfolio Kernel Source Map

- `frontend/src/os/kernel/kernel.ts` is the public facade. Apps use it for `getApps()`, `search()`, `runCommand()`, recruiter data, signals, and provider-backed app data.
- `frontend/src/os/kernel/searchIndex.ts` builds Sawyer Search from apps, projects, skills, resume highlights, case studies, commands, and recruiter proof.
- `frontend/src/os/kernel/commandRegistry.ts` parses Terminal commands into typed system actions such as open app, open search, launch world, reset OS, clear, or print lines.
- `frontend/src/os/kernel/recruiterProfile.ts` is the single source of truth for Sawyer's target roles, pitch, skills, links, resume route, and value proposition.
- `frontend/src/os/services/portfolioDataProvider.ts` defines the provider interface that a future API adapter can implement.
- `frontend/src/os/services/mockPortfolioDataProvider.ts` is the current in-browser mock implementation with localStorage-backed demo state.
- `frontend/src/os/services/apiPortfolioDataProvider.ts` is intentionally a thin placeholder seam for a future backend, not active runtime code.

## Functional Evidence Apps

- **Sawyer Search:** internal fake search across the OS. `hire sawyer` prioritizes Recruiter Quick View, Resume, Projects, Contact, and Case Studies.
- **Recruiter Quick View:** hiring-focused dashboard with role fit, proof signals, and CTAs.
- **Sprint Planner:** interactive roadmap and task-status board for project planning and internship preparation.
- **Scope Budget:** interactive time, complexity, recruiter-value, and risk tradeoff model.
- **Developer Habits:** check-in style habit tracker for coding, docs, commits, DSA practice, testing, and polish.

## Portfolio Case Study

**Why this exists:** A normal portfolio can list projects, but a portfolio OS demonstrates the work directly. It shows frontend architecture, UI state, interaction design, product framing, and full-stack ownership in one memorable interface.

**Tradeoff:** ASP.NET Core remains the server foundation instead of a full Next.js rewrite. That keeps routes, RSS, sitemap, Markdown content, and tests stable while React owns the interactive surface where it matters.

**What recruiters can inspect:** app registry architecture, Portfolio Kernel, search indexing, provider-ready data flow, window management, terminal commands, functional evidence apps, responsive constraints, reduced-motion support, and a clear 3D roadmap.

**3D direction:** The current Launch World mode is a CSS prototype. A later branch should add React Three Fiber and Drei for a compact scene where projects, resume, and contact become clickable stations.

## Development

```powershell
npm install
npm run typecheck
npm run build:client
dotnet test Portfolio.Tests\Portfolio.Tests.csproj
```

## Roadmap

- Promote the world-mode prototype to a React Three Fiber mini-scene.
- Add browser-level interaction tests for drag, resize, terminal commands, and launcher search.
- Replace placeholder contact links with real profiles before publishing.
