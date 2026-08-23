export type NavLink = { href: string; label: string };

// Single source for the in-page sections, shared by the header and the footer
// so a new section can never end up linked from one and orphaned in the other.
export const sectionLinks: NavLink[] = [
  // "About" covers the hero + about intro, so it points at the very top.
  { href: "#top", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  // "Skills" also stands in for the certifications carousel below it.
  { href: "#skills", label: "Skills" },
];
