type FooterLink = { href: string; label: string; external?: boolean; mail?: boolean };

const navLinks: FooterLink[] = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

const connectLinks: FooterLink[] = [
  { href: "https://github.com/jakeoreillyy", label: "GitHub", external: true },
  { href: "https://www.linkedin.com/in/jake-o-reilly", label: "LinkedIn", external: true },
  {
    href: "https://drive.google.com/file/d/1g9zu01wSZb98pxBCtKQLQGVbjlgI6hR5/view?usp=drive_link",
    label: "Resume",
    external: true,
  },
  { href: "https://leetcode.com/u/jakeoreilly/", label: "LeetCode", external: true },
  { href: "#contact", label: "Contact", mail: true },
];

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-1.5 inline-block size-3.5 align-[-2px]"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] text-faint uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
              {link.external && <span aria-hidden="true"> ↗</span>}
              {link.mail && <MailIcon />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:flex-row md:justify-between">
        <div>
          <a
            href="#top"
            className="font-mono text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            Jake O'Reilly
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Building from Dublin, Ireland. ☘️
          </p>
        </div>
        <div className="flex gap-12 sm:gap-20">
          <FooterColumn title="Navigate" links={navLinks} />
          <FooterColumn title="Connect" links={connectLinks} />
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jake O'Reilly. All rights reserved.</p>
          <a href="#top" className="transition-colors hover:text-accent">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
