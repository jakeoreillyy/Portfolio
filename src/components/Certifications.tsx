import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { ArrowUpRightIcon, ChevronIcon } from "./icons";

type Cert = {
  title: string;
  issuer: string;
  date: string;
  meta: string;
  tag: string;
  image: string;
  imageSize: [width: number, height: number];
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
    imageSize: [760, 439],
    credentialUrl: "https://drive.google.com/file/d/1_t_71bJ6y3-lkrjQJGOO5C_q6-3_kQwt/view",
  },
  {
    title: "Fundamentals of Deep Learning",
    issuer: "NVIDIA",
    date: "Dec 2024",
    meta: "Certificate of Competency",
    tag: "Machine learning",
    image: "/certs/nvidia-deep-learning.webp",
    imageSize: [760, 649],
    credentialUrl: "https://learn.nvidia.com/certificates?id=01odK5ZsSkOEBhyeCFTXzA",
  },
  {
    title: "ChatGPT Prompt Engineering for Developers",
    issuer: "DeepLearning.AI · OpenAI",
    date: "Sep 2025",
    meta: "Short course · 1h 30m",
    tag: "AI / LLMs",
    image: "/certs/prompt-engineering.webp",
    imageSize: [760, 504],
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
    imageSize: [1600, 1190],
    credentialUrl:
      "https://drive.google.com/file/d/1CvG45OVGshNH59Wp0sxH0tAa1hYq1z5g/view?usp=sharing",
  },
  {
    title: "ML Summer School",
    issuer: "Cohere Labs",
    date: "Aug 2026",
    meta: "Participant",
    tag: "Machine learning",
    image: "/certs/cohere-machine-learning.webp",
    imageSize: [600, 424],
    credentialUrl:
      "https://drive.google.com/file/d/1Cm8fnmnf4gPzAOgm_LruzJcuECbxt8ub/view?usp=sharing",
  },
];

const N = certs.length;
const OFF = 250; // horizontal offset of the neighbour cards, px
const SIDE_SCALE = 0.82; // how much the neighbours shrink
const VEIL = 0.5; // how much the neighbours are dimmed (solid veil opacity, never card transparency)
const INTERVAL = 4500; // autoplay cadence, ms
const TRANS = "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)";
const VEIL_TRANS = "opacity 0.45s ease";

// mt aligns the 44px button with the vertical centre of the card artwork.
const ARROW =
  "mt-[164px] hidden size-11 shrink-0 cursor-pointer items-center justify-center rounded-full " +
  "border border-line-bright bg-raised text-foreground shadow-[0_8px_22px_rgba(0,0,0,0.65)] " +
  "transition-colors hover:border-accent hover:bg-accent hover:text-background sm:flex";

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

export function Certifications() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [navNonce, setNavNonce] = useState(0);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const activeRef = useRef(0);
  const prevRel = useRef<number[]>(certs.map(() => 0));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const veilRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef({ active: false, startX: 0, dx: 0 });

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
      // Off-centre cards are only hidden visually, so without inert their
      // "View credential" links stay tabbable behind the veil.
      el.inert = rel !== 0;
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

  // navNonce restarts the timer after a manual nav, so a click or swipe always
  // buys a full INTERVAL before the next auto-advance.
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % N), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, navNonce, reduced]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, startX: e.clientX, dx: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
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
    else {
      // Aborted drag: snap back, and still restart the autoplay timer.
      positionAll(0, false);
      setNavNonce((x) => x + 1);
    }
  };

  return (
    <section id="certifications" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mt-2 font-mono text-3xl font-semibold tracking-tight">Certifications</h2>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          {/* The arrows flank the track as flex siblings rather than sitting on top
              of it, so they land on page background instead of on the dimmed
              neighbour cards. Below sm they collapse and the track takes the full
              width, leaving swipe + dots as the controls. */}
          {/* Pause on focus as well as hover, so a keyboard user reading a card
              doesn't have it auto-advance out from under them. */}
          <div
            className="mx-auto flex max-w-[51rem] items-start justify-center gap-3.5"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <button
              type="button"
              onClick={() => nav(-1)}
              aria-label="Previous certificate"
              className={ARROW}
            >
              <ChevronIcon dir="left" size={20} />
            </button>

            <div className="w-full max-w-2xl min-w-0">
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
                          width={c.imageSize[0]}
                          height={c.imageSize[1]}
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
                          <ArrowUpRightIcon size={15} />
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
                    className={`h-[7px] cursor-pointer rounded-full transition-all duration-300 ${
                      i === active ? "w-[22px] bg-accent" : "w-[7px] bg-line-strong hover:bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => nav(1)}
              aria-label="Next certificate"
              className={ARROW}
            >
              <ChevronIcon dir="right" size={20} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
