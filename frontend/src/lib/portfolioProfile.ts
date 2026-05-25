import profileConfig from "../../../Portfolio/Content/Profile/portfolio-profile.json";
import type { ContactLink, RecruiterProfile } from "./types";

export type PortfolioProfileConfig = {
  name: string;
  headline: string;
  email: string;
  links: {
    github: string;
    linkedin: string;
    x: string;
    resumePage: string;
    resumePdf: string;
  };
  targetRoles: string[];
  shortPitch: string;
  valueProposition: string;
  skills: string[];
  aiCapabilities: string[];
  projectHighlights: string[];
  workHighlights: string[];
};

export type LoginQuickLinkConfig = {
  label: "GitHub" | "LinkedIn" | "X" | "Email" | "Resume";
  href: string;
  external: boolean;
};

export const portfolioProfileConfig = profileConfig as PortfolioProfileConfig;

export function getProfileContactLinks(config: PortfolioProfileConfig = portfolioProfileConfig): ContactLink[] {
  return [
    { label: "Email", value: config.email, href: `mailto:${config.email}` },
    { label: "GitHub", value: displayUrl(config.links.github), href: config.links.github },
    { label: "LinkedIn", value: displayUrl(config.links.linkedin), href: config.links.linkedin },
    { label: "X", value: displayUrl(config.links.x), href: config.links.x }
  ];
}

export function getProfileLoginQuickLinks(config: PortfolioProfileConfig = portfolioProfileConfig): LoginQuickLinkConfig[] {
  return [
    { label: "GitHub", href: config.links.github, external: true },
    { label: "LinkedIn", href: config.links.linkedin, external: true },
    { label: "X", href: config.links.x, external: true },
    { label: "Email", href: `mailto:${config.email}`, external: false },
    { label: "Resume", href: config.links.resumePage, external: false }
  ];
}

export function getResumeDownload(config: PortfolioProfileConfig = portfolioProfileConfig) {
  const filename = config.links.resumePdf.split("/").filter(Boolean).at(-1) ?? "resume.pdf";
  return {
    href: config.links.resumePdf,
    filename
  };
}

export function createRecruiterProfileFromConfig(
  config: PortfolioProfileConfig = portfolioProfileConfig
): RecruiterProfile {
  return {
    name: config.name,
    targetRoles: config.targetRoles,
    shortPitch: config.shortPitch,
    valueProposition: config.valueProposition,
    skills: config.skills,
    projectHighlights: config.projectHighlights,
    workHighlights: config.workHighlights,
    contactLinks: getProfileContactLinks(config),
    resumeLink: config.links.resumePage
  };
}

function displayUrl(value: string) {
  return value
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}
