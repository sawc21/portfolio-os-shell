---
title: Portfolio Platform
slug: portfolio-platform
summary: A database-free ASP.NET Core portfolio built around Razor Pages, Markdown content, SEO basics, RSS, and sitemap generation.
date: 2026-05-14
tags: ASP.NET, C#, Razor Pages, Markdown
featured: true
phase: prototype
role: Product design + ASP.NET
visual: /images/projects/kernel-gallery.svg
visualAlt: Graphic minimalist isometric kernel gallery branch preview
branches: identity system|content engine|deployment path
---
# Portfolio Platform

This project starts as the foundation for the whole personal site. The architecture favors reliability in the kernel and expressive design at the surface: server-rendered Razor Pages, repository-backed Markdown content, and a visual system that can grow into a richer personal operating environment.

## Architecture

- ASP.NET Core Razor Pages for the public routes.
- Markdown files for blog posts, projects, and resume content.
- A small content service for front matter parsing, Markdown rendering, ordering, and slug lookup.
- RSS and sitemap endpoints generated from the same content source.

## Product thinking

The portfolio has to persuade quickly while still rewarding exploration. That means the first version needs strong navigation, readable case studies, and an identity that signals design judgment without hiding the C# foundation.

## Branches explored

- **Identity system:** Move from generic developer portfolio to Kernel Gallery.
- **Content engine:** Keep Markdown simple while adding fields for phase, role, visuals, and branches.
- **Deployment path:** Keep managed hosting practical while leaving room for self-hosted experiments.

## Next steps

The next useful additions are real project screenshots, production deployment, downloadable resume output, and a `/lab` section for self-hosting writeups.
