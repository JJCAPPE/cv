export const links = {
  github: "https://github.com/JJCAPPE",
  linkedin: "https://www.linkedin.com/in/giacomo-cappelletto",
  resume: "/resume.pdf",
  email: "mailto:giacomo.cappelletto@icloud.com",
} as const;

export const primaryLinks = [
  { label: "GitHub", href: links.github },
  { label: "LinkedIn", href: links.linkedin },
  { label: "Resume", href: links.resume },
  { label: "Email", href: links.email },
] as const;
