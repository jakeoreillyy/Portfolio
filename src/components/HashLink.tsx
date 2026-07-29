import type { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type HashLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  onHomePage: boolean;
};

// Plain anchor on the home page (Lenis smooth-scrolls same-page hash clicks);
// router Link everywhere else (cross-page hash jump, handled by ScrollReset).
export function HashLink({ hash, onHomePage, ...props }: HashLinkProps) {
  return onHomePage ? <a href={hash} {...props} /> : <Link to={`/${hash}`} {...props} />;
}
