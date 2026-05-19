import aboutIcon from "../assets/os-icons/about.png";
import budgetIcon from "../assets/os-icons/budget.png";
import caseStudiesIcon from "../assets/os-icons/case-studies.png";
import contactIcon from "../assets/os-icons/contact.png";
import filesIcon from "../assets/os-icons/files.png";
import habitsIcon from "../assets/os-icons/habits.png";
import notesIcon from "../assets/os-icons/notes.png";
import plannerIcon from "../assets/os-icons/planner.png";
import projectsIcon from "../assets/os-icons/projects.png";
import recruiterIcon from "../assets/os-icons/recruiter.png";
import resumeIcon from "../assets/os-icons/resume.png";
import searchIcon from "../assets/os-icons/search.png";
import skillsIcon from "../assets/os-icons/skills.png";
import terminalIcon from "../assets/os-icons/terminal.png";
import worldIcon from "../assets/os-icons/world.png";
import type { AppId } from "./types";

export const appIconAssets: Partial<Record<AppId, string>> = {
  about: aboutIcon,
  recruiter: recruiterIcon,
  search: searchIcon,
  files: filesIcon,
  projects: projectsIcon,
  skills: skillsIcon,
  "case-studies": caseStudiesIcon,
  notes: notesIcon,
  resume: resumeIcon,
  terminal: terminalIcon,
  contact: contactIcon,
  planner: plannerIcon,
  budget: budgetIcon,
  habits: habitsIcon,
  world: worldIcon
};
