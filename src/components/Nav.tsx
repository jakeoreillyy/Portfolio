import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MailIcon } from "./icons";
import { accentButton } from "../lib/styles";

// Contact sits apart as the pill, so it isn't listed here.
const pageLinks = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
];

export function Nav() {
  const location = useLocation();
  const onContact = location.pathname === "/contact";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Same type as the Contact pill beside them, so the three read as one set.
  const linkBase =
    "relative font-mono text-[13px] transition-colors " +
    "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left " +
    "after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100";

  // On /contact the pill is already "arrived", so it renders pre-filled.
  const contactStyle = onContact
    ? "inline-flex items-center gap-1.5 rounded border border-accent bg-accent px-3.5 py-1.5 font-mono text-[13px] text-background"
    : accentButton;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-line bg-background/60 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      {/* box-content puts the padding outside max-w-7xl, so the nav's edges line
          up with the hero and sections below it. */}
      <nav className="mx-auto box-content flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-[15px] tracking-[-0.02em] text-foreground"
        >
          <img
            src="/ascii-pfp.webp"
            alt="ASCII art portrait of Jake O'Reilly"
            width={28}
            height={28}
            className="size-7 rounded-full border border-line"
          />
          Jake O'Reilly
        </Link>
        {/* Tighter gaps on phones keep the name on one line down to 360px. */}
        <div className="flex items-center gap-3 sm:gap-5">
          {pageLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
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
      </nav>
    </header>
  );
}
