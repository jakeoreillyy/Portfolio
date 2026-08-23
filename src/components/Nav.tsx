import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "./HashLink";
import { MailIcon } from "./icons";
import { sectionLinks } from "../data/nav";

export function Nav() {
  const location = useLocation();
  const onContact = location.pathname === "/contact";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (onContact) return;

    // The "About" and "Skills" links each cover more than one on-page section,
    // so map every observed id back to the nav link it should light up.
    const idToLink: Record<string, string> = {
      top: "#top",
      about: "#top",
      experience: "#experience",
      education: "#education",
      projects: "#projects",
      skills: "#skills",
      certifications: "#skills",
    };
    const sections = Object.keys(idToLink)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(idToLink[entry.target.id] ?? null);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onContact]);

  const linkBase =
    "relative font-mono text-[13px] transition-colors " +
    "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[2px] after:origin-left " +
    "after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100";

  const contactBase =
    "inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 font-mono text-[13px] transition-colors";
  const contactStyle = onContact
    ? "border-accent bg-accent text-background"
    : "border-accent/40 text-accent hover:border-accent hover:bg-accent hover:text-background";

  const barLine = "absolute left-0 block h-[2px] w-5 rounded-full bg-current";

  // A section is highlighted only on the home page; `null` means the hero.
  const isActive = (href: string | null) => !onContact && active === href;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open
          ? "border-line bg-background/60 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <HashLink
          hash="#top"
          className="font-mono text-sm font-semibold tracking-tight text-foreground"
        >
          Jake O'Reilly
        </HashLink>
        <div className="hidden items-center gap-5 lg:flex">
          {sectionLinks.map((link) => (
            <HashLink
              key={link.href}
              hash={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`${linkBase} ${
                isActive(link.href)
                  ? "text-foreground after:scale-x-100"
                  : "text-muted after:scale-x-0 hover:text-foreground"
              }`}
            >
              {link.label}
            </HashLink>
          ))}
          <Link to="/contact" className={`${contactBase} ${contactStyle}`}>
            <MailIcon size={14} />
            Contact
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="-mr-1 p-1 text-muted transition-colors hover:text-foreground lg:hidden"
        >
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span
              className={`${barLine} top-0 transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`${barLine} top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`${barLine} bottom-0 transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>
      {/* `inert` while collapsed keeps the panel out of both the tab order and
          the accessibility tree, so screen readers don't read a second nav. */}
      <div
        inert={!open}
        className={`grid overflow-hidden transition-all duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col border-t border-line px-4 pt-2 pb-4">
            {sectionLinks.map((link) => (
              <HashLink
                key={link.href}
                hash={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-2 py-2.5 font-mono text-sm transition-colors ${
                  isActive(link.href) ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </HashLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className={`${contactBase} mt-3 self-start ${contactStyle}`}
            >
              <MailIcon size={14} />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
