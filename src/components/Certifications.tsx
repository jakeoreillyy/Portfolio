import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type Cert = {
  title: string;
  issuer: string;
  date: string;
  meta: string;
  tag: string;
  image: string;
  credentialUrl: string;
};

const certs: Cert[] = [
  {
    title: "GitHub Foundations",
    issuer: "DataCamp",
    date: "Mar 2026",
    meta: "9hrs",
    tag: "Version control",
    image: "/certs/github-foundations.webp",
    credentialUrl: "https://drive.google.com/file/d/1_t_71bJ6y3-lkrjQJGOO5C_q6-3_kQwt/view",
  },
  {
    title: "Fundamentals of Deep Learning",
    issuer: "NVIDIA",
    date: "Dec 2024",
    meta: "Certificate of Competency",
    tag: "Machine learning",
    image: "/certs/nvidia-deep-learning.webp",
    credentialUrl: "https://learn.nvidia.com/certificates?id=01odK5ZsSkOEBhyeCFTXzA",
  },
  {
    title: "ChatGPT Prompt Engineering for Developers",
    issuer: "DeepLearning.AI · OpenAI",
    date: "Sep 2025",
    meta: "Short course · 1h 30m",
    tag: "AI / LLMs",
    image: "/certs/prompt-engineering.webp",
    credentialUrl:
      "https://learn.deeplearning.ai/accomplishments/392bde75-9365-4f85-a0f7-28c570ddf76c",
  },
  {
    title: "The Complete SQL Bootcamp",
    issuer: "Udemy",
    date: "Apr 2025",
    meta: "9hrs",
    tag: "Databases",
    image: "/certs/sql-bootcamp.webp",
    credentialUrl:
      "https://drive.google.com/file/d/1CvG45OVGshNH59Wp0sxH0tAa1hYq1z5g/view?usp=sharing",
  },
];

const N = certs.length;
const OFF = 250; // horizontal offset of the neighbour cards, px
const SIDE_SCALE = 0.82; // how much the neighbours shrink
const VEIL = 0.5; // how much the neighbours are dimmed (solid veil opacity, never card transparency)
const INTERVAL = 4500; // autoplay cadence, ms
const TRANS = "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)";
const VEIL_TRANS = "opacity 0.45s ease";

type Slot = { x: number; scale: number; veil: number };

function slotFor(rel: number): Slot {
  if (rel === 0) return { x: 0, scale: 1, veil: 0 };
  if (rel === 1) return { x: OFF, scale: SIDE_SCALE, veil: VEIL };
  if (rel === -1) return { x: -OFF, scale: SIDE_SCALE, veil: VEIL };
  // Only reachable with 4+ certs: parked fully behind the (opaque) centre card.
  return { x: 0, scale: SIDE_SCALE * 0.9, veil: 1 };
}

function relOf(i: number, active: number): number {
  let r = (((i - active) % N) + N) % N;
  if (r > N / 2) r -= N;
  return r;
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export function Certifications() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [navNonce, setNavNonce] = useState(0);

  const activeRef = useRef(0);
  const prevRel = useRef<number[]>(certs.map(() => 0));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const veilRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useRef(false);
  const drag = useRef({ active: false, startX: 0, dx: 0, captured: -1 });

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Position every card imperatively. Cards stay fully opaque at all times; the
  // wrap-around card teleports (transition: none) so it is never seen sliding
  // across, and dimming is done with a solid veil, not card transparency.
  const positionAll = useCallback((dragPx = 0, dragging = false) => {
    const act = activeRef.current;
    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      const veil = veilRefs.current[i];
      if (!el) continue;
      const rel = relOf(i, act);
      const s = slotFor(rel);

      if (dragging) {
        el.style.transition = "none";
        if (veil) veil.style.transition = "none";
      } else {
        const teleport = Math.abs(rel - prevRel.current[i]) > 1;
        el.style.transition = teleport ? "none" : TRANS;
        if (veil) veil.style.transition = teleport ? "none" : VEIL_TRANS;
        prevRel.current[i] = rel;
      }

      el.style.transform = `translateX(${s.x + dragPx}px) scale(${s.scale})`;
      el.style.zIndex = rel === 0 ? "30" : "20";
      if (veil) veil.style.opacity = String(s.veil);
    }
  }, []);

  useLayoutEffect(() => {
    activeRef.current = active;
    positionAll(0, false);
  }, [active, positionAll]);

  const nav = useCallback((dir: number) => {
    setActive((a) => (((a + dir) % N) + N) % N);
    setNavNonce((x) => x + 1);
  }, []);

  const jump = useCallback((i: number) => {
    setActive(i);
    setNavNonce((x) => x + 1);
  }, []);

  useEffect(() => {
    if (reduced.current || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % N), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, navNonce]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, startX: e.clientX, dx: 0, captured: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.startX;
    positionAll(drag.current.dx * 0.6, true);
  };
  const onPointerUp = () => {
    if (!drag.current.active) return;
    const dx = drag.current.dx;
    drag.current.active = false;
    if (dx < -55) nav(1);
    else if (dx > 55) nav(-1);
    else positionAll(0, false);
    setNavNonce((x) => x + 1);
  };

  return (
    <section id="certifications" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-sm text-faint">// what I've earned</p>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Certifications</h2>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div
            className="relative mx-auto max-w-2xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <button
              type="button"
              onClick={() => nav(-1)}
              aria-label="Previous certificate"
              className="absolute top-[166px] left-[-4px] z-40 hidden size-10 items-center justify-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:flex"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              type="button"
              onClick={() => nav(1)}
              aria-label="Next certificate"
              className="absolute top-[166px] right-[-4px] z-40 hidden size-10 items-center justify-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:flex"
            >
              <ChevronIcon dir="right" />
            </button>

            <div
              className="relative h-[372px] cursor-grab overflow-hidden active:cursor-grabbing"
              style={{ touchAction: "pan-y" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {certs.map((c, i) => (
                <div
                  key={c.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute top-2 left-1/2 -ml-[150px] w-[300px] will-change-transform"
                >
                  <div className="relative overflow-hidden rounded-[14px] border border-line-strong bg-surface">
                    <div className="flex h-[150px] items-center justify-center border-b border-line bg-background p-3">
                      <img
                        src={c.image}
                        alt={`${c.title} certificate`}
                        loading="lazy"
                        draggable={false}
                        className="max-h-full max-w-full object-contain select-none"
                      />
                    </div>

                    <div className="p-5">
                      <p className="font-mono text-[10.5px] tracking-[0.15em] text-accent uppercase">
                        {c.tag}
                      </p>
                      <h3 className="mt-2 min-h-[44px] font-mono text-[16.5px] leading-[1.34] font-medium text-foreground">
                        {c.title}
                      </h3>
                      <p className="mt-2 text-[13px] text-muted">{c.issuer}</p>
                      <div className="mt-1.5 flex items-center gap-3.5">
                        <span className="font-mono text-[11.5px] text-faint">{c.date}</span>
                        <span className="font-mono text-[11.5px] text-faint">{c.meta}</span>
                      </div>
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-accent/40 px-3.5 py-1.5 font-mono text-[12.5px] text-accent transition-colors hover:border-accent hover:bg-accent hover:text-background"
                      >
                        View credential
                        <ArrowUpRightIcon />
                      </a>
                    </div>

                    {/* Solid veil dims the neighbours without ever making the card
                        itself transparent, so you never see through to the card behind. */}
                    <div
                      ref={(el) => {
                        veilRefs.current[i] = el;
                      }}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[14px] bg-background"
                      style={{ opacity: 0 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {certs.map((c, i) => (
                <button
                  key={c.title}
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={`Go to ${c.title}`}
                  aria-current={i === active}
                  className={`h-[7px] rounded-full transition-all duration-300 ${
                    i === active ? "w-[22px] bg-accent" : "w-[7px] bg-line-strong hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
