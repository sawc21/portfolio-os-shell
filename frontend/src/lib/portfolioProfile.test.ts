import { describe, expect, test } from "vitest";
import {
  createRecruiterProfileFromConfig,
  getProfileContactLinks,
  getProfileLoginQuickLinks,
  getResumeDownload
} from "./portfolioProfile";

const profileConfig = {
  name: "Sawyer Cawthon",
  headline: "AI-focused software developer",
  email: "sawyer.cawthon@gmail.com",
  links: {
    github: "https://github.com/sawc21",
    linkedin: "https://www.linkedin.com/in/sawyer-cawthon-a87560287/",
    x: "https://x.com/sawyerc_cs",
    resumePage: "/resume",
    resumePdf: "/files/sawyer-cawthon-resume.pdf"
  },
  targetRoles: ["AI Software Intern", "Full-stack Developer"],
  shortPitch: "Builds AI-capable product systems.",
  valueProposition: "Can wire AI projects into useful portfolio software.",
  skills: ["C#", "ASP.NET Core", "React", "LLM workflows"],
  aiCapabilities: ["Agent workflow design", "Knowledge graph prototypes"],
  projectHighlights: ["Portfolio OS", "QuickBooks MCP planning"],
  workHighlights: ["NASA/Barrios DataMine research assistant"]
};

describe("portfolio profile adapter", () => {
  test("maps profile links into shared contact links", () => {
    expect(getProfileContactLinks(profileConfig)).toEqual([
      { label: "Email", value: "sawyer.cawthon@gmail.com", href: "mailto:sawyer.cawthon@gmail.com" },
      { label: "GitHub", value: "github.com/sawc21", href: "https://github.com/sawc21" },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/sawyer-cawthon-a87560287",
        href: "https://www.linkedin.com/in/sawyer-cawthon-a87560287/"
      },
      { label: "X", value: "x.com/sawyerc_cs", href: "https://x.com/sawyerc_cs" }
    ]);
  });

  test("creates recruiter profile from canonical config", () => {
    const recruiterProfile = createRecruiterProfileFromConfig(profileConfig);

    expect(recruiterProfile.name).toBe("Sawyer Cawthon");
    expect(recruiterProfile.resumeLink).toBe("/resume");
    expect(recruiterProfile.contactLinks[1].href).toBe("https://github.com/sawc21");
    expect(recruiterProfile.skills).toContain("LLM workflows");
  });

  test("exposes login quick links and resume download metadata", () => {
    expect(getProfileLoginQuickLinks(profileConfig).map((link) => link.label)).toEqual([
      "GitHub",
      "LinkedIn",
      "X",
      "Email",
      "Resume"
    ]);

    expect(getResumeDownload(profileConfig)).toEqual({
      href: "/files/sawyer-cawthon-resume.pdf",
      filename: "sawyer-cawthon-resume.pdf"
    });
  });
});
