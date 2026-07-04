import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
];

function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function Nav() {
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
    const ids = ["top", ...links.map((link) => link.href.slice(1)), "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(entry.target.id === "top" ? null : `#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const linkBase =
    "relative font-mono text-[13px] transition-colors " +
    "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-[2px] after:origin-left " +
    "after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100";

  const contactBase =
    "inline-flex items-center gap-2 rounded-lg border px-3.5 py-1.5 font-mono text-[13px] transition-colors";
  const contactStyle =
    active === "#contact"
      ? "border-accent bg-accent text-background"
      : "border-accent/40 text-accent hover:border-accent hover:bg-accent hover:text-background";

  const barLine = "absolute left-0 block h-[2px] w-5 rounded-full bg-current";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open
          ? "border-line bg-background/60 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight text-foreground">
          Jake O'Reilly
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a
            href="#top"
            aria-current={active === null ? "page" : undefined}
            className={`${linkBase} ${
              active === null
                ? "text-foreground after:scale-x-100"
                : "text-muted after:scale-x-0 hover:text-foreground"
            }`}
          >
            Home
          </a>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${linkBase} ${
                active === link.href
                  ? "text-foreground after:scale-x-100"
                  : "text-muted after:scale-x-0 hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className={`${contactBase} ${contactStyle}`}>
            <MailIcon />
            Contact
          </a>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="-mr-1 p-1 text-muted transition-colors hover:text-foreground md:hidden"
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
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col border-t border-line px-4 pt-2 pb-4">
            <a
              href="#top"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={`rounded-md px-2 py-2.5 font-mono text-sm transition-colors ${
                active === null ? "text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              Home
            </a>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className={`rounded-md px-2 py-2.5 font-mono text-sm transition-colors ${
                  active === link.href ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={`${contactBase} mt-3 self-start ${contactStyle}`}
            >
              <MailIcon />
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
