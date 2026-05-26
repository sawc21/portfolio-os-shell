import profileConfig from "../../../Portfolio/Content/Profile/portfolio-profile.json";
import type { ContactLink, RecruiterProfile } from "./types";

export type PortfolioProfileConfig = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
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
  systemCapabilities: string[];
  projectHighlights: string[];
  workHighlights: string[];
};

export type LoginQuickLinkConfig = {
  label: "GitHub" | "LinkedIn" | "X" | "Email" | "Phone" | "Resume";
  href: string;
  external: boolean;
};

export const portfolioProfileConfig = profileConfig as PortfolioProfileConfig;

export function getProfileContactLinks(config: PortfolioProfileConfig = portfolioProfileConfig): ContactLink[] {
  return [
    { label: "Email", value: config.email, href: `mailto:${config.email}`, kind: "email" },
    { label: "Phone", value: config.phone, href: phoneHref(config.phone), kind: "phone" },
    { label: "Location", value: config.location, href: locationHref(config.location), kind: "location" },
    { label: "GitHub", value: displayUrl(config.links.github), href: config.links.github, kind: "link" },
    { label: "LinkedIn", value: displayUrl(config.links.linkedin), href: config.links.linkedin, kind: "link" },
    { label: "X", value: displayUrl(config.links.x), href: config.links.x, kind: "link" }
  ];
}

export function getProfileLoginQuickLinks(config: PortfolioProfileConfig = portfolioProfileConfig): LoginQuickLinkConfig[] {
  return [
    { label: "GitHub", href: config.links.github, external: true },
    { label: "LinkedIn", href: config.links.linkedin, external: true },
    { label: "X", href: config.links.x, external: true },
    { label: "Email", href: `mailto:${config.email}`, external: false },
    { label: "Phone", href: phoneHref(config.phone), external: false },
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
    phone: config.phone,
    location: config.location,
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

function phoneHref(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `tel:+1${digits}` : `tel:${value}`;
}

function locationHref(value: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}
