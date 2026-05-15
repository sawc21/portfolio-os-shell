# Portfolio Operating System

This portfolio is an ASP.NET Core Razor Pages site with a modern React/TypeScript client mounted on the homepage. The first interactive layer is a fake desktop operating system: visitors can open draggable portfolio apps, use a terminal, inspect projects and resume highlights, and launch a lightweight world-mode prototype.

## Internship Portfolio Value

- **Full-stack foundation:** ASP.NET Core keeps public routes, Markdown content, RSS, sitemap, and route tests stable.
- **Frontend architecture:** React components are split into OS shell, window management, app registry, mock data, and terminal commands.
- **Interaction design:** The homepage behaves like an operating system with taskbar state, start menu, draggable windows, minimized apps, and keyboard escape handling.
- **Creative technology path:** The Launch World flow currently uses a boot overlay and CSS spatial prototype, leaving a clear next phase for React Three Fiber and Drei.

## Current Stack

- ASP.NET Core Razor Pages and xUnit route tests.
- Vite, React, TypeScript, Motion, and Lucide icons.
- Custom CSS for the OS design system and responsive desktop/mobile behavior.
- Mock data only for planner, budget, and habits.

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
- Add reduced-motion polish and browser-level interaction tests.
- Write a case study explaining the architecture and phased 3D roadmap.
