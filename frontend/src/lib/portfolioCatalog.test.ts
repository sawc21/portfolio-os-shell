import { describe, expect, test } from "vitest";
import {
  getArchiveProjects,
  getCatalogProjects,
  getFeaturedProjects,
  getPublicationItems,
  portfolioCatalog
} from "./portfolioCatalog";

describe("portfolio catalog", () => {
  test("loads expected public GitHub and meaningful local projects", () => {
    const projects = getCatalogProjects();
    const slugs = projects.map((project) => project.slug);

    expect(slugs).toContain("portfolio-os-shell");
    expect(slugs).toContain("quickbooks-toolkit");
    expect(slugs).toContain("note-taking-app");
    expect(slugs).toContain("extraction");
    expect(slugs).toContain("smartselect-awards-aggregate");
    expect(slugs).toContain("inventory-management");
    expect(slugs).toContain("planner");
    expect(slugs).toContain("asp-net-todolist");
    expect(slugs).not.toContain("quickbooks-systems");
  });

  test("keeps project slugs unique and featured projects inside the full catalog", () => {
    const projects = getCatalogProjects();
    const featured = getFeaturedProjects();
    const archive = getArchiveProjects();
    const projectSlugs = new Set(projects.map((project) => project.slug));

    expect(projectSlugs.size).toBe(projects.length);
    expect(featured.length).toBeGreaterThan(0);
    expect(archive.length).toBeGreaterThan(0);
    expect(featured.every((project) => projectSlugs.has(project.slug))).toBe(true);
    expect(archive.every((project) => projectSlugs.has(project.slug))).toBe(true);
  });

  test("featured projects include clearly marked proof placeholders", () => {
    const featured = getFeaturedProjects();

    expect(featured.every((project) => project.visualProof?.kind === "placeholder")).toBe(true);
    expect(featured.every((project) => (project.proofSlots?.length ?? 0) > 0)).toBe(true);
    expect(featured.some((project) => project.visualProof?.status === "needs-screenshot")).toBe(true);
    expect(
      featured.some((project) => project.proofSlots?.some((slot) => slot.status === "needs-architecture-diagram"))
    ).toBe(true);
    expect(featured.some((project) => project.proofSlots?.some((slot) => slot.status === "needs-demo-capture"))).toBe(true);
  });

  test("publication list uses resume-sourced paper claims without fabricated links", () => {
    const publications = getPublicationItems();
    const titles = publications.map((publication) => publication.title);

    expect(titles).toContain("Semantic Chunking and Consensus Filtering for Structured Extraction of Cyber Threat Intelligence.");
    expect(titles).toContain("Automated Validation and Repair of Knowledge Graph Triples for Cyber Threat Intelligence.");
    expect(titles).toContain("Co-authored published academic paper on NASA Artemis Gateway simulation architecture and system impact.");
    expect(publications.every((publication) => publication.url === undefined)).toBe(true);
    expect(publications.every((publication) => publication.citationStatus === "Citation pending verification")).toBe(true);
    expect(publications.every((publication) => publication.venueStatus === "Venue pending")).toBe(true);
    expect(publications.every((publication) => publication.doiStatus === "DOI unavailable")).toBe(true);
    expect(publications.every((publication) => publication.pdfStatus === "PDF link unavailable")).toBe(true);
    expect(portfolioCatalog.cv.honors).toContain("Published Research Author");
  });
});
