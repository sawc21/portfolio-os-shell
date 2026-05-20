# Portfolio OS Codebase Guide

This guide documents the current Portfolio OS worktree on `codex/retro-windows-os-refinement`. It is meant for someone who can read code, but has not yet built a mental map of this specific architecture.

The project is a hybrid app:

- ASP.NET Core Razor Pages serves the site shell, direct-link fallback pages, Markdown content, RSS, sitemap, static assets, and tests.
- Vite builds a React/TypeScript client into `Portfolio/wwwroot/dist`.
- The homepage mounts a full-screen fake operating system. Portfolio content opens as apps inside draggable windows.
- The Portfolio Kernel is a lightweight TypeScript layer that connects app metadata, commands, search, recruiter profile data, mock data, and future API provider seams.

## Start Here

Read these files first, in this order:

1. `Portfolio/Program.cs` - server startup, Razor Pages, static assets, sitemap, RSS.
2. `Portfolio/Pages/Index.cshtml` - homepage OS mount point, no-JS fallback links, Vite bundle includes.
3. `frontend/src/main.tsx` - React entry point that mounts `Desktop`.
4. `frontend/src/components/os/Desktop.tsx` - OS shell state: windows, focus, start menu, icon order, world mode.
5. `frontend/src/lib/appRegistry.ts` - source of truth for app metadata.
6. `frontend/src/os/kernel/kernel.ts` - public Portfolio Kernel facade.
7. `frontend/src/os/services/portfolioDataProvider.ts` - API-ready data contract.
8. `frontend/src/components/os/apps/PortfolioApps.tsx` - app content views rendered inside windows.
9. `Portfolio.Tests/PublicRouteTests.cs` - route-level expectations for the ASP.NET shell and homepage mount.

Useful commands:

```powershell
npm run typecheck
npm run build:client
dotnet test Portfolio.Tests\Portfolio.Tests.csproj
rg "portfolioKernel" frontend/src
rg "appId" frontend/src/components/os
rg "MapGet" Portfolio
```

## Architecture Overview

### Server Shell

The ASP.NET Core side lives under `Portfolio/`.

- `Portfolio/Program.cs` configures Razor Pages, `MarkdownContentService`, static assets, `/sitemap.xml`, and `/feed.xml`.
- `Portfolio/Pages/` contains traditional Razor fallback routes such as Projects, Blog, Resume, Contact, and Error.
- `Portfolio/Pages/Shared/_Layout.cshtml` owns site metadata, Open Graph tags, shared CSS, and switches chrome when `ViewData["Chrome"] = "os"`.
- `Portfolio/Content/` stores Markdown-backed project, blog, and resume content.
- `Portfolio/wwwroot/` stores public static assets, generated Vite bundles, CSS, images, robots.txt, and legacy static files.

The key decision is that the homepage is no longer a normal landing page. `Portfolio/Pages/Index.cshtml` renders a single `[data-portfolio-os]` mount plus fallback navigation. React takes over from there.

Traditional routes still matter. They provide direct links, SEO, tests, and fallback content. Do not remove them just because the OS has equivalent apps.

### React OS Client

The React client lives under `frontend/src/`.

- `frontend/src/main.tsx` mounts `<Desktop />`.
- `frontend/src/components/os/Desktop.tsx` is the shell coordinator.
- `frontend/src/components/os/DesktopIconGrid.tsx` and `DesktopIcon.tsx` render the clickable, reorderable desktop icons.
- `frontend/src/components/os/WindowManager.tsx` maps open window state to actual `Window` components.
- `frontend/src/components/os/Window.tsx` implements draggable/resizable/minimized/maximized window chrome.
- `frontend/src/components/os/StartMenu.tsx` renders launcher/search behavior.
- `frontend/src/components/os/Taskbar.tsx` renders Start, quick launch, open window buttons, Launch World, and tray.
- `frontend/src/components/os/WorldPreview.tsx` is the current lightweight world-mode prototype.
- `frontend/src/styles/os.css` owns the retro Windows skin, desktop wallpaper, taskbar, windows, app cards, and responsive behavior.

The shell should manage shell behavior only. It should not own project data, recruiter copy, search ranking, or app-specific business logic.

### Portfolio Kernel

The kernel lives under `frontend/src/os/kernel/`.

- `kernel.ts` exports `portfolioKernel`, the public facade used by app views and shell components.
- `appRegistry.ts` adapts the app registry from `frontend/src/lib/appRegistry.ts`.
- `commandRegistry.ts` parses terminal commands into typed `SystemAction` objects.
- `searchIndex.ts` builds and ranks fake internal search results.
- `recruiterProfile.ts` stores one source of truth for Sawyer's pitch, roles, skills, links, and resume path.
- `portfolioSignals.ts` stores reusable proof points for hiring-oriented views.
- `systemActions.ts` defines action helpers for opening apps, search, world mode, reset, clear, and print flows.

The kernel exists so multiple UI surfaces stay in sync. Search, Terminal, Recruiter Quick View, Resume, Contact, File Explorer, and Start Menu should all read the same app/profile/provider data instead of duplicating it.

### Data and Mock State

The data provider layer lives under `frontend/src/os/services/`.

- `portfolioDataProvider.ts` defines the API-ready interface.
- `mockPortfolioDataProvider.ts` is the current implementation using mock data and localStorage-backed demo state.
- `localPortfolioState.ts` contains localStorage helpers.
- `apiPortfolioDataProvider.ts` is intentionally not wired yet. It throws so nobody accidentally thinks API data exists.

Static mock data lives in `frontend/src/lib/mockData.ts`. It supplies projects, resume highlights, skills, case studies, notes, File Explorer entries, sprint planner tasks, scope budget data, habits, boot lines, and world roadmap.

Interactive demo state is harmless localStorage:

- `portfolio-os:windows:v2`
- `portfolio-os:desktop-icon-order:v1`
- `portfolio-os:sprint-planner:v1`
- `portfolio-os:scope-budget:v1`
- `portfolio-os:developer-habits:v1`

Do not store real personal, financial, health, auth, or private recruiter data here.

### Build Output

Vite is configured in `frontend/vite.config.js`.

- Input: `frontend/src/main.tsx`
- Output directory: `Portfolio/wwwroot/dist`
- Stable bundle names: `portfolio-os.js`, `portfolio-os.css`
- Non-CSS assets go under `Portfolio/wwwroot/dist/assets/`

Because ASP.NET serves the generated files, frontend changes usually need `npm run build:client` before route/browser verification sees the latest bundle.

## Load-Bearing Concepts

### App Definitions

`frontend/src/lib/appRegistry.ts` is the central app metadata list. Each app definition controls:

- App id and title.
- Desktop icon label.
- Category and tags.
- Lucide fallback icon and pixel asset mapping.
- Whether it appears on the desktop and in the launcher.
- Terminal command aliases.
- Default window size and position.

This registry feeds desktop icons, launcher apps, search docs, terminal command aliases, window creation, and app lookup. If a new app is not registered here, most OS surfaces will not know it exists.

### App Components

`frontend/src/components/os/apps/appComponents.ts` maps each `AppId` to a React component from `PortfolioApps.tsx`.

This is the second required registration point for new apps. The app registry says the app exists; `appComponents` says what renders when the app opens.

### Window State

`Desktop.tsx` owns open window state:

- `windows`
- `focusedAppId`
- `zCursor`
- `appParams`
- minimized/maximized/position/size data

`WindowManager.tsx` receives this state and renders windows. `Window.tsx` handles pointer interactions and calls callbacks back into `Desktop`.

Keep content logic out of window state. Window code should not know what a project, resume highlight, or recruiter signal means.

### System Actions

Terminal and search do not directly mutate the desktop. They return `SystemAction` values such as:

- `open-app`
- `open-search`
- `launch-world`
- `reset-os`
- `clear`
- `print`

The UI layer decides how to execute those actions. This keeps command parsing and shell mutation separated.

### Provider Boundary

`PortfolioDataProvider` is the seam for future API-backed behavior. App views should call `portfolioKernel`, which calls the provider. That means future backend work can replace provider methods without rewriting app components.

Use this boundary for any new functional demo app. Add data shape/types first, then provider methods, then app UI.

## How To Trace Features

### Opening an App

Trace this path:

1. `frontend/src/lib/appRegistry.ts` defines the app metadata.
2. `Desktop.tsx` calls `portfolioKernel.getDesktopApps()` and renders `DesktopIconGrid`.
3. `DesktopIcon.tsx` calls `onOpen(app.id)` after click, Enter, or Space.
4. `Desktop.openApp()` creates a `WindowInstance` using the app's default window data.
5. `WindowManager.tsx` looks up `appComponents[window.appId]`.
6. `Window.tsx` renders the window chrome and the app component.

The Start menu and taskbar quick launch call the same `openApp` path. Terminal commands produce `SystemAction` values that also end in `openApp`.

### Searching

Trace this path:

1. `SearchApp` calls `portfolioKernel.search(query)`.
2. `kernel.ts` delegates to `searchPortfolio(query, provider)`.
3. `searchIndex.ts` builds documents from apps, projects, skills, profile, resume highlights, case studies, commands, signals, and file entries.
4. Search ranks results, with special priority rules such as `hire sawyer`.
5. Clicking a result executes the result action, usually opening an app.

Add searchable content by adding it to the provider or registry, not by hardcoding into `SearchApp`.

### Terminal Commands

Trace this path:

1. `TerminalApp` sends text to `portfolioKernel.runCommand(command)`.
2. `commandRegistry.ts` normalizes the command and returns a `SystemAction`.
3. `TerminalApp` executes the action by opening apps, opening Search with params, launching world mode, resetting OS state, clearing output, or printing lines.

If you add a new command, add metadata to `commandDefinitions` and parser behavior to `runKernelCommand`.

### Direct Routes and SEO

Trace this path:

1. `Portfolio/Program.cs` maps Razor Pages and custom XML endpoints.
2. Razor pages under `Portfolio/Pages/` serve direct URLs.
3. `MarkdownContentService` loads Markdown from `Portfolio/Content/`.
4. `PublicRouteTests` verifies homepage, project/blog/resume/contact routes, sitemap, RSS, and robots.txt.

When adding server content, update Markdown files and route tests if public behavior changes.

## Delegation Strategies

### Backend and Content

Natural work:

- Add or edit Markdown content.
- Add Razor fallback pages.
- Update sitemap/RSS behavior.
- Improve metadata, canonical URLs, or content rendering.
- Add route tests and Markdown parsing tests.

Safe edit zones:

- `Portfolio/Content/`
- `Portfolio/Pages/`
- `Portfolio/Content/MarkdownContentService.cs`
- `Portfolio.Tests/`

Watch dependencies:

- `Program.cs` sitemap/feed paths.
- `_Layout.cshtml` metadata and OS chrome switch.
- Existing route tests.
- Markdown front matter requirements.

Good isolated tasks:

- Add a new project Markdown file and test it appears in `/projects`.
- Add front matter validation to `MarkdownContentService`.
- Improve RSS feed metadata without touching the React OS.

### OS Shell

Natural work:

- Desktop icon behavior.
- Window movement, resizing, minimizing, restoring, focusing.
- Start menu and taskbar behavior.
- World mode shell transitions.
- Keyboard shortcuts and accessibility.

Safe edit zones:

- `frontend/src/components/os/Desktop.tsx`
- `frontend/src/components/os/DesktopIconGrid.tsx`
- `frontend/src/components/os/DesktopIcon.tsx`
- `frontend/src/components/os/Window.tsx`
- `frontend/src/components/os/Taskbar.tsx`
- `frontend/src/components/os/StartMenu.tsx`
- `frontend/src/components/os/WorldPreview.tsx`
- `frontend/src/lib/desktopIconLayout.ts`

Watch dependencies:

- localStorage keys in `Desktop.tsx`.
- `WindowInstance` type in `types.ts`.
- CSS layering in `os.css`, especially `.window-layer` and icon clickability.
- Browser/mobile behavior after pointer changes.

Good isolated tasks:

- Add snap-to-screen safeguards for windows.
- Add keyboard focus cycling between windows.
- Improve mobile desktop icon layout.
- Add a command palette without touching app content.

### App Views

Natural work:

- Add app-specific UI.
- Reframe or expand portfolio content.
- Add interactions inside Planner, Scope Budget, Habits, Search, File Explorer, Resume, Contact, etc.
- Add CTAs that open other apps.

Safe edit zones:

- `frontend/src/components/os/apps/PortfolioApps.tsx`
- `frontend/src/components/os/apps/appComponents.ts`
- `frontend/src/lib/mockData.ts`
- `frontend/src/os/services/mockPortfolioDataProvider.ts`

Watch dependencies:

- App component props in `OsAppComponentProps`.
- Provider methods expected by `portfolioKernel`.
- Search ranking if new app content should be searchable.
- Avoid putting app data directly into window manager code.

Good isolated tasks:

- Split `PortfolioApps.tsx` into one file per app.
- Add richer File Explorer details.
- Add a Case Study app section explaining the retro OS design.
- Improve Search empty states and result grouping.

### Kernel, Search, and Terminal

Natural work:

- Add commands.
- Tune search ranking.
- Add recruiter profile data.
- Add portfolio signals.
- Define new system actions.
- Keep app metadata and command aliases synchronized.

Safe edit zones:

- `frontend/src/os/kernel/`
- `frontend/src/lib/appRegistry.ts`
- `frontend/src/lib/types.ts`

Watch dependencies:

- `AppId` union in `types.ts`.
- `appComponents` mapping.
- `SearchResult.action` values.
- Terminal output expectations.

Good isolated tasks:

- Add `open notes` or `open files` command aliases.
- Add result categories or highlighting.
- Add `whoami` and `experience` commands.
- Add a recruiter-focused search boost for new keywords.

### Data Provider and Future API Work

Natural work:

- Move mock data behind cleaner provider methods.
- Add API-backed provider implementation later.
- Add optimistic local state for demo interactions.
- Define DTOs and server endpoints in a future backend phase.

Safe edit zones:

- `frontend/src/os/services/portfolioDataProvider.ts`
- `frontend/src/os/services/mockPortfolioDataProvider.ts`
- `frontend/src/os/services/apiPortfolioDataProvider.ts`
- `frontend/src/os/services/localPortfolioState.ts`
- `frontend/src/lib/types.ts`

Watch dependencies:

- Keep provider methods synchronous unless you intentionally migrate app views to async/loading states.
- If future APIs become async, plan a larger UI state refactor.
- Keep demo localStorage harmless.

Good isolated tasks:

- Add reset support for one app's demo state.
- Add provider methods for new case-study content.
- Stub a typed API provider without wiring network calls.

### Styling and Assets

Natural work:

- Retro Windows skin.
- Pixel wallpaper and icon assets.
- Responsive layout polish.
- Window and app content visual hierarchy.

Safe edit zones:

- `frontend/src/styles/os.css`
- `frontend/src/assets/os-icons/`
- `frontend/src/assets/wallpapers/`
- `frontend/src/lib/appIconAssets.ts`
- `Portfolio/wwwroot/dist/assets/` after build

Watch dependencies:

- Vite copies imported assets into `Portfolio/wwwroot/dist/assets`.
- `Portfolio/wwwroot/dist` is generated but tracked for deployment.
- CSS has earlier base styles and later retro overrides. Later rules usually win.
- Pointer events matter. `.window-layer` must not block desktop icon clicks outside real windows.

Good isolated tasks:

- Replace or refine icon artwork.
- Improve selected icon state.
- Add high contrast or reduced motion variants.
- Polish app cards while keeping Windows-style chrome.

## Adding a New App

Use this checklist:

1. Add the new id to `AppId` in `frontend/src/lib/types.ts`.
2. Add an app definition in `frontend/src/lib/appRegistry.ts`.
3. Add the React app component in `PortfolioApps.tsx` or a split app file.
4. Register the component in `appComponents.ts`.
5. Add mock/provider data if the app needs content.
6. Add search documents through provider data or registry tags.
7. Add terminal aliases in the app definition or `commandRegistry.ts`.
8. Add an icon asset and map it in `appIconAssets.ts` if needed.
9. Run `npm run typecheck`, `npm run build:client`, and browser-check opening the app from desktop, Start, taskbar, search, and terminal where applicable.

Do not hardcode app metadata in the desktop, taskbar, search app, and terminal separately. The registry is the source of truth.

## Adding Searchable Content

Prefer this order:

1. Put content in the provider-backed data layer, usually `mockData.ts`.
2. Expose it through `PortfolioDataProvider` if it is a new content type.
3. Add a document builder in `searchIndex.ts`.
4. Return a typed action, usually `open-app`.
5. Add a priority match only for high-value queries such as hiring, internship, stack, testing, or 3D.

Search is intentionally fake and local. It should feel useful, but it should not become a database or backend search system yet.

## Testing Strategy

For backend or route changes:

```powershell
dotnet test Portfolio.Tests\Portfolio.Tests.csproj
```

For frontend source changes:

```powershell
npm run typecheck
npm run build:client
```

For visual or interaction work:

- Start the app with `dotnet run --project Portfolio --urls http://127.0.0.1:5186`.
- Check desktop icons, Start menu, taskbar, window open/focus/minimize/restore, terminal commands, search, File Explorer, and mobile width.
- Use browser screenshots when working on wallpaper, icons, or layout.

For Markdown parsing:

- Add focused tests in `Portfolio.Tests/MarkdownContentServiceTests.cs`.
- Use temporary content roots like the existing tests.

For public fallback behavior:

- Add assertions in `Portfolio.Tests/PublicRouteTests.cs`.
- Keep homepage fallback links, RSS, sitemap, and route success tests stable.

## Common Gotchas

- The root workspace and OS worktree can be on different branches. This guide targets `C:\Users\SawyerCawthon\.config\superpowers\worktrees\PortFolio\portfolio-os-shell` on `codex/retro-windows-os-refinement`.
- The root workspace may contain untracked `Portfolio/oracleJdk-26/`; do not touch it unless explicitly asked.
- `Portfolio/wwwroot/dist` is build output, but it is part of what ASP.NET serves. If frontend changes should be visible without a dev server, rebuild it.
- `Desktop.tsx` persists window and icon state in localStorage. Use Reset OS or clear localStorage when testing layout changes.
- `mockPortfolioDataProvider` also persists Planner, Scope Budget, and Habits demo state. Reset OS clears those provider keys.
- `apiPortfolioDataProvider.ts` intentionally throws. It marks the future API seam; it is not a broken implementation.
- `PortfolioApps.tsx` is currently large. It is okay for now, but future app-heavy work should split it into separate files.
- CSS has both base skin and retro skin sections. Check later rules before assuming an earlier selector is active.
- Search and Terminal should return actions, not directly mutate shell state.
- File Explorer source-path clicks copy paths to the clipboard when no app or href exists.

## Work Delegation Cheatsheet

Use this when splitting work across people or agents:

| Work item | Best owner area | Main files | Verification |
| --- | --- | --- | --- |
| Add a project/case-study page | Backend/content | `Portfolio/Content`, `Portfolio/Pages/Projects`, `MarkdownContentService` | `dotnet test` |
| Add a new OS app | Frontend apps/kernel | `types.ts`, `appRegistry.ts`, `appComponents.ts`, `PortfolioApps.tsx` | `npm run typecheck`, `npm run build:client` |
| Improve window behavior | OS shell | `Desktop.tsx`, `Window.tsx`, `WindowManager.tsx` | browser interaction check |
| Improve icon reordering | OS shell/layout | `DesktopIconGrid.tsx`, `DesktopIcon.tsx`, `desktopIconLayout.ts` | browser drag/click check |
| Add terminal commands | Kernel/terminal | `commandRegistry.ts`, `TerminalApp` | terminal browser check |
| Tune search | Kernel/search | `searchIndex.ts`, provider data | search app browser check |
| Add API readiness | Data provider | `portfolioDataProvider.ts`, `apiPortfolioDataProvider.ts`, provider callers | typecheck plus app smoke check |
| Polish retro UI | Styling/assets | `os.css`, assets, generated `dist` | build plus screenshot |
| Route or SEO changes | Backend shell | `Program.cs`, `_Layout.cshtml`, Razor pages | `dotnet test` |

When in doubt, keep shell behavior, app content, kernel logic, and server content separate. That separation is the main thing making the Portfolio OS maintainable.
