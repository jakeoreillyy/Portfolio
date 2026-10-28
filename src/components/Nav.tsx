import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MailIcon } from "./icons";
import { accentButton } from "../lib/styles";
import { lenisRef } from "../lib/useLenis";

// Contact sits apart as the pill, so it isn't listed here.
const pageLinks = [
  { to: "/", label: "Home" },
];

export function Nav() {
  const location = useLocation();
  const onContact = location.pathname === "/contact";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Close the dropdown after navigating.
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Router won't re-navigate to the current route, so ScrollReset never fires;
  // scroll up by hand when a link to "/" is clicked while already on it.
  const onHomeClick = (to: string) => {
    setOpen(false);
    if (to !== "/" || location.pathname !== "/") return;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { lerp: 0.1 });
    else window.scrollTo({ top: 0 });
  };

  // Same type as the Contact pill beside them, so the three read as one set.
  const linkBase =
    "relative font-mono text-[13px] transition-colors " +
    "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left " +
    "after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100";

  // On /contact the pill is already "arrived", so it renders pre-filled.
  const contactStyle = onContact
    ? "inline-flex items-center gap-1.5 rounded border border-accent bg-accent px-3.5 py-1.5 font-mono text-[13px] text-background"
    : accentButton;

  const barLine = "absolute left-0 block h-[2px] w-5 rounded-full bg-current";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open
          ? "border-line bg-background/60 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* box-content puts the padding outside max-w-7xl, so the nav's edges line
          up with the hero and sections below it. */}
      <nav className="mx-auto box-content flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          onClick={() => onHomeClick("/")}
          className="flex items-center gap-2.5 font-display text-[15px] tracking-[-0.02em] text-foreground"
        >
          <img
            src="/ascii-pfp-small.webp"
            alt="ASCII art portrait of Jake O'Reilly"
            width={28}
            height={28}
            className="size-7 rounded-full border border-line"
          />
          Jake O'Reilly
        </Link>
        <div className="hidden items-center gap-5 min-[480px]:flex">
          {pageLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => onHomeClick(to)}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "text-foreground after:scale-x-100"
                    : "text-muted after:scale-x-0 hover:text-foreground"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className={contactStyle}>
            <MailIcon size={14} />
            Contact
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="-mr-1 p-1 text-muted transition-colors hover:text-foreground min-[480px]:hidden"
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
        className={`grid overflow-hidden transition-all duration-300 ease-out min-[480px]:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col border-t border-line px-4 pt-2 pb-4">
            {pageLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => onHomeClick(to)}
                className={({ isActive }) =>
                  `rounded-md px-2 py-2.5 font-mono text-[13px] transition-colors ${
                    isActive ? "text-foreground" : "text-muted hover:text-foreground"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className={`${contactStyle} mt-3 self-start`}
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
