import catalogConfig from "../../../Portfolio/Content/Profile/portfolio-catalog.json";
import type { CatalogProject, PortfolioCatalog, ProjectItem, PublicationItem } from "./types";

export const portfolioCatalog = catalogConfig as PortfolioCatalog;

export function getCatalogProjects(catalog: PortfolioCatalog = portfolioCatalog): CatalogProject[] {
  return catalog.projects;
}

export function getFeaturedProjects(catalog: PortfolioCatalog = portfolioCatalog): CatalogProject[] {
  return catalog.projects.filter((project) => project.featured);
}

export function getArchiveProjects(catalog: PortfolioCatalog = portfolioCatalog): CatalogProject[] {
  return catalog.projects.filter((project) => project.archive);
}

export function getPublicationItems(catalog: PortfolioCatalog = portfolioCatalog): PublicationItem[] {
  return catalog.publications;
}

export function getCatalogProjectItems(catalog: PortfolioCatalog = portfolioCatalog): ProjectItem[] {
  return catalog.projects.map((project) => ({
    title: project.title,
    slug: project.slug,
    phase: project.phase,
    role: project.role,
    summary: project.summary,
    tags: project.tags,
    branches: project.branches
  }));
}
