# Portfolio Operating System

This portfolio is an ASP.NET Core Razor Pages site with a modern React/TypeScript client mounted as the full-screen homepage. The main experience is a fake desktop operating system: visitors open apps, drag icons, manage windows, use a terminal, inspect portfolio content, and launch a lightweight world-mode prototype.

## Internship Portfolio Value

- **Full-stack foundation:** ASP.NET Core keeps public routes, Markdown content, RSS, sitemap, and route tests stable.
- **Frontend architecture:** React components are split into OS shell, window management, app registry, mock data, and terminal commands.
- **Interaction design:** The homepage behaves like an operating system with taskbar state, launcher search, draggable desktop icons, draggable/resizable windows, minimized apps, and keyboard escape handling.
- **Creative technology path:** The Launch World flow currently uses a boot overlay and CSS spatial prototype, leaving a clear next phase for React Three Fiber and Drei.

## Current Stack

- ASP.NET Core Razor Pages and xUnit route tests.
- Vite, React, TypeScript, Motion, and Lucide icons.
- Custom CSS for the OS design system and responsive desktop/mobile behavior.
- Mock data only for planner, budget, and habits.

## Architecture Notes

- The Razor homepage is intentionally thin: it provides metadata, a no-JS fallback, and the React mount.
- Traditional pages remain available as stable direct-link and SEO fallbacks, but primary navigation now lives inside the OS.
- Apps are registered in a single app registry with ids, icons, tags, command aliases, launcher visibility, desktop visibility, and default window geometry.
- App content is data-driven through mock data files so the window manager stays focused on shell behavior.
- Local storage stores desktop icon positions and the current window session; Reset OS clears back to the curated default layout.

## Portfolio Case Study

**Why this exists:** A normal portfolio can list projects, but a portfolio OS demonstrates the work directly. It shows frontend architecture, UI state, interaction design, product framing, and full-stack ownership in one memorable interface.

**Tradeoff:** ASP.NET Core remains the server foundation instead of a full Next.js rewrite. That keeps routes, RSS, sitemap, Markdown content, and tests stable while React owns the interactive surface where it matters.

**What recruiters can inspect:** app registry architecture, window management, terminal commands, mocked productivity apps, responsive constraints, reduced-motion support, and a clear 3D roadmap.

**3D direction:** The current Launch World mode is a CSS prototype. A later branch should add React Three Fiber and Drei for a compact scene where projects, resume, and contact become clickable stations.

## Development

```powershell
npm install
npm run typecheck
npm run build:client
dotnet test Portfolio.Tests\Portfolio.Tests.csproj
```

## Roadmap

- Replace placeholder contact links with real profiles.
- Promote the world-mode prototype to a React Three Fiber mini-scene.
- Add browser-level interaction tests for drag, resize, terminal commands, and launcher search.
- Replace placeholder contact links with real profiles before publishing.
