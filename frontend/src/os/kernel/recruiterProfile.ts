import type { RecruiterProfile } from "../../lib/types";

export const recruiterProfile: RecruiterProfile = {
  name: "Sawyer Cawthon",
  targetRoles: [
    "Software development internship",
    "Frontend engineering internship",
    "Full-stack engineering internship"
  ],
  shortPitch:
    "Product-minded developer building a portfolio that demonstrates React architecture, ASP.NET fundamentals, interaction design, and disciplined iteration.",
  valueProposition:
    "Sawyer can contribute to teams that need clean UI implementation, thoughtful product tradeoffs, maintainable TypeScript, and a willingness to learn full-stack systems.",
  skills: [
    "React",
    "TypeScript",
    "ASP.NET Core",
    "C#",
    "Razor Pages",
    "Vite",
    "Testing",
    "Accessibility",
    "Interaction design"
  ],
  projectHighlights: [
    "Full-screen Portfolio OS with draggable icons, window management, taskbar state, search, and terminal commands.",
    "ASP.NET Core portfolio foundation with route tests, Markdown content, RSS, sitemap, and SEO fallbacks.",
    "Creative technology roadmap for a focused React Three Fiber portfolio world."
  ],
  contactLinks: [
    { label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
    { label: "GitHub", value: "github.com/your-handle", href: "https://github.com/" },
    { label: "LinkedIn", value: "linkedin.com/in/your-handle", href: "https://www.linkedin.com/" }
  ],
  resumeLink: "/resume"
};
