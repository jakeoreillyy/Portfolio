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
      {/* decorative shell prompt; reserved-width role keeps the prompt from shifting */}
      <span aria-hidden="true" className="whitespace-nowrap">
        <span className="text-[#7bbf6a]">jake@portfolio</span>
        <span className="text-foreground">:</span>
        <span className="text-[#6aa0d8]">~</span>
        <span className="text-accent">$</span>{" "}
        <span className="inline-block min-w-[25ch] text-left align-bottom text-foreground">
          {reduced ? words[0] : text}
          <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-accent" />
        </span>
      </span>
      <span className="sr-only">Computer science student, software engineer, and AI engineer</span>
    </span>
  );
}
