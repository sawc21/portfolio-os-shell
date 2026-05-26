import { describe, expect, test } from "vitest";
import {
  createRecruiterProfileFromConfig,
  getProfileContactLinks,
  getProfileLoginQuickLinks,
  getResumeDownload
} from "./portfolioProfile";

const profileConfig = {
  name: "Sawyer Cawthon",
  headline: "Computer Science undergraduate focused on AI, cybersecurity, and backend systems",
  email: "cawthonsawyer@gmail.com",
  phone: "(325) 213-4321",
  location: "San Angelo, TX",
  links: {
    github: "https://github.com/sawc21",
    linkedin: "https://www.linkedin.com/in/sawyer-cawthon-a87560287/",
    x: "https://x.com/sawyerc_cs",
    resumePage: "/resume",
    resumePdf: "/files/sawyer-cawthon-resume.pdf"
  },
  targetRoles: ["Software Engineering Intern", "Full-stack Developer"],
  shortPitch: "Builds product systems.",
  valueProposition: "Can wire project ideas into useful portfolio software.",
  skills: ["C#", "ASP.NET Core", "React", "Workflow design"],
  systemCapabilities: ["Workflow design", "Knowledge graph prototypes"],
  projectHighlights: ["Portfolio OS", "QuickBooks integration planning"],
  workHighlights: ["NASA/Barrios DataMine research assistant"]
};

describe("portfolio profile adapter", () => {
  test("maps profile links into shared contact links", () => {
    expect(getProfileContactLinks(profileConfig)).toEqual([
      { label: "Email", value: "cawthonsawyer@gmail.com", href: "mailto:cawthonsawyer@gmail.com", kind: "email" },
      { label: "Phone", value: "(325) 213-4321", href: "tel:+13252134321", kind: "phone" },
      {
        label: "Location",
        value: "San Angelo, TX",
        href: "https://www.google.com/maps/search/?api=1&query=San%20Angelo%2C%20TX",
        kind: "location"
      },
      { label: "GitHub", value: "github.com/sawc21", href: "https://github.com/sawc21", kind: "link" },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/sawyer-cawthon-a87560287",
        href: "https://www.linkedin.com/in/sawyer-cawthon-a87560287/",
        kind: "link"
      },
      { label: "X", value: "x.com/sawyerc_cs", href: "https://x.com/sawyerc_cs", kind: "link" }
    ]);
  });

  test("creates recruiter profile from canonical config", () => {
    const recruiterProfile = createRecruiterProfileFromConfig(profileConfig);

    expect(recruiterProfile.name).toBe("Sawyer Cawthon");
    expect(recruiterProfile.location).toBe("San Angelo, TX");
    expect(recruiterProfile.resumeLink).toBe("/resume");
    expect(recruiterProfile.contactLinks[3].href).toBe("https://github.com/sawc21");
    expect(recruiterProfile.skills).toContain("Workflow design");
  });

  test("exposes login quick links and resume download metadata", () => {
    expect(getProfileLoginQuickLinks(profileConfig).map((link) => link.label)).toEqual([
      "GitHub",
      "LinkedIn",
      "X",
      "Email",
      "Phone",
      "Resume"
    ]);

    expect(getResumeDownload(profileConfig)).toEqual({
      href: "/files/sawyer-cawthon-resume.pdf",
      filename: "sawyer-cawthon-resume.pdf"
    });
  });
});
