import { useEffect, useState } from "react";

const words = ["computer science student", "software engineer", "ai engineer"];

const TYPE_SPEED = 85;
const DELETE_SPEED = 40;
const HOLD_FULL = 1600;
const HOLD_EMPTY = 350;

export function Typewriter() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (reduced) return;

    const current = words[index];
    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

    if (!deleting && text === current) delay = HOLD_FULL;
    else if (deleting && text === "") delay = HOLD_EMPTY;

    const timeout = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText((t) =>
          deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1),
        );
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, deleting, index, reduced]);

  return (
    <span className="font-mono">
      {/* Decorative shell prompt, deliberately the one splash of colour left on the
          site, sharing the about.ts card's Tokyo Night palette. */}
      {/* Only the prompt itself is unbreakable: below ~334px the typed line wraps
          underneath it rather than pushing the page into a sideways scroll. */}
      <span aria-hidden="true">
        <span className="whitespace-nowrap">
          <span className="text-code-string">jake@portfolio</span>
          <span className="text-code-text">:</span>
          <span className="text-code-key">~</span>
          <span className="text-code-text">$</span>
        </span>{" "}
        <span className="inline-block min-w-[25ch] text-left align-bottom text-code-text">
          {reduced ? words[0] : text}
          <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-code-text" />
        </span>
      </span>
      <span className="sr-only">Computer science student, software engineer, and AI engineer</span>
    </span>
  );
}
