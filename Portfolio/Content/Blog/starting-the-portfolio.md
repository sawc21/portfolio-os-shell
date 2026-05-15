---
title: Starting the Portfolio
slug: starting-the-portfolio
summary: The first build note for a C#-native personal site that starts simple and leaves room for self-hosted experiments.
date: 2026-05-14
tags: ASP.NET, Razor Pages, Hosting
featured: true
---
# Starting the Portfolio

The first decision is to keep the public portfolio reliable and boring in the right places. Razor Pages handles the public HTML, Markdown files keep writing close to the code, and deployment can start on a managed ASP.NET host before any self-hosting work enters the critical path.

That split keeps the site useful immediately while still leaving room for a `/lab` section, Cloudflare Tunnel notes, VPS experiments, and small APIs later.

## Launch shape

- A fast homepage that explains the technical direction.
- Project pages written as case studies, not just cards.
- Blog posts that document tradeoffs and build decisions.
- A resume page generated from content in the repository.

The goal is not to ship every idea at once. The goal is to make the first version strong enough to publish, then let the site evolve in public.

## Current direction

The public identity is Kernel Gallery: a graphic-minimalist system view that treats design/product thinking as the interface and ASP.NET, C#, and self-hosting as the kernel underneath.
