import { Link } from "react-router-dom";
import { HashLink } from "./HashLink";
import { MailIcon } from "./icons";
import { sectionLinks } from "../data/nav";
import type { NavLink } from "../data/nav";

type FooterLink = NavLink & { external?: boolean; mail?: boolean };

const navLinks: FooterLink[] = [{ href: "#top", label: "Home" }, ...sectionLinks];

const connectLinks: FooterLink[] = [
  { href: "https://github.com/jakeoreillyy", label: "GitHub", external: true },
  { href: "https://www.linkedin.com/in/jake-o-reilly", label: "LinkedIn", external: true },
  {
    href: "https://drive.google.com/file/d/1g9zu01wSZb98pxBCtKQLQGVbjlgI6hR5/view?usp=drive_link",
    label: "Resume",
    external: true,
  },
  { href: "https://leetcode.com/u/jakeoreilly/", label: "LeetCode", external: true },
  { href: "/contact", label: "Contact", mail: true },
];

const linkClass = "text-sm text-muted transition-colors hover:text-accent";

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.2em] text-faint uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {link.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : link.href.startsWith("#") ? (
              <HashLink hash={link.href} className={linkClass}>
                {link.label}
              </HashLink>
            ) : (
              <Link to={link.href} className={linkClass}>
                {link.label}
                {link.mail && <MailIcon className="ml-1.5 inline-block size-3.5 align-[-2px]" />}
              </Link>
            )}
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
          <Link
            to="/"
            className="font-mono text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            Jake O'Reilly
          </Link>
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
