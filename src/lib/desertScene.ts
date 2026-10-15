import { prefersReducedMotion } from "./prefersReducedMotion";

// The empty blog page's desert scene: a hand-drawn line sketch of a fence,
// two telephone poles and a tumbleweed rolling across. Built as plain SVG
// paths from code (no image to download) and loaded on demand by
// DesertScene, so none of it ships in the main bundle.

type Pt = [number, number];
type Stroke = { d: string; stroke: string; width: number };

// The scene is laid out in a fixed 300-unit height and scaled to whatever
// height the page gives it; the width follows the screen, so wide screens get
// more road, not a bigger drawing.
const VIEW_H = 300;
// Widths are tuned against this, the size of the approved mockup.
const REF_W = 680;

// Greys tuned against the black page background: the poles read brightest,
// the wires and grass sit well back.
const INK = {
  horizon: "#7a7a7a",
  grass: "#5f5f5f",
  pole: "#e8e8e8",
  wire: "#4f4f4f",
  fence: "#8e8e8e",
  fenceWire: "#666666",
  shadow: "#2f2f2f",
  tumbleweed: "#d2d2d2",
};

const SCENE_SEED = 21;
// The tumbleweed has its own stream so it's the same shape at every screen
// width. This state reproduces the one picked from the mockup.
const TUMBLEWEED_SEED = -1316705419;
const TUMBLEWEED_R = 21;

// One fixed roll, the same every pass: a slow start, a gust, a hop with a
// small rebound about a quarter of the way across, then a smaller hop.
const HOPS = [
  { at: 0.28, duration: 0.42, height: 9, rebound: true },
  { at: 0.64, duration: 0.34, height: 5, rebound: false },
];
const PAUSE_BETWEEN_PASSES = 2.6;

// mulberry32: a tiny seeded PRNG, so the sketch comes out identical on every
// load and redraws the same way after a resize.
function seeded(seed: number) {
  let s = seed;
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return { next, range: (a: number, b: number) => a + (b - a) * next() };
}

const fmt = (n: number) => n.toFixed(1);

// Catmull-Rom through the points, as cubic Béziers, so nothing is drawn with
// a ruler-straight segment.
function smooth(points: Pt[]): string {
  let d = `M${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i - 1] ?? points[i];
    const b = points[i];
    const c = points[i + 1];
    const e = points[i + 2] ?? c;
    d +=
      `C${fmt(b[0] + (c[0] - a[0]) / 6)} ${fmt(b[1] + (c[1] - a[1]) / 6)} ` +
      `${fmt(c[0] - (e[0] - b[0]) / 6)} ${fmt(c[1] - (e[1] - b[1]) / 6)} ${fmt(c[0])} ${fmt(c[1])}`;
  }
  return d;
}

// A sagging span between two points (power lines, slack fence wire).
const sag = (p: Pt, q: Pt, k: number) =>
  `Q${fmt((p[0] + q[0]) / 2)} ${fmt((p[1] + q[1]) / 2 + Math.hypot(q[0] - p[0], q[1] - p[1]) * k)} ` +
  `${fmt(q[0])} ${fmt(q[1])}`;

// Ground heights: the horizon the scenery stands on, and the road in front
// where the tumbleweed rolls. Both undulate a little so neither is flat.
const horizonY = (x: number) => 204 + 1.6 * Math.sin(x / 110 + 0.4) + 0.8 * Math.sin(x / 37 + 1.7);
const roadY = (x: number) => 248 + 2 * Math.sin(x / 70 + 1) + Math.sin(x / 23);

type Scene = {
  width: number;
  scenery: Stroke[];
  tumbleweed: Stroke[];
  // Outline points, used to keep the lumpy tumbleweed touching the road.
  hull: Pt[];
};

function buildScene(width: number): Scene {
  const rand = seeded(SCENE_SEED);

  // Strokes are pooled by style and joined into one path each, so the whole
  // scene is a handful of elements rather than a couple of hundred.
  const pools = new Map<string, Stroke>();
  const draw = (d: string, stroke: string, w: number) => {
    const key = `${stroke}|${w}`;
    const pool = pools.get(key);
    if (pool) pool.d += d;
    else pools.set(key, { d, stroke, width: w });
  };

  // A hand-drawn line: straight-ish, with a slight sideways wobble.
  const wobbly = (x1: number, y1: number, x2: number, y2: number, amp = 0.7, step = 14) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(2, Math.round(len / step));
    const nx = -(y2 - y1) / len;
    const ny = (x2 - x1) / len;
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const j = i && i < n ? rand.range(-amp, amp) : 0;
      pts.push([x1 + (x2 - x1) * t + nx * j, y1 + (y2 - y1) * t + ny * j]);
    }
    return smooth(pts);
  };

  // Horizon.
  const horizon: Pt[] = [];
  for (let x = -10; x <= width + 10; x += 10)
    horizon.push([x, horizonY(x) + rand.range(-0.3, 0.3)]);
  draw(smooth(horizon), INK.horizon, 1.2);

  // Dry grass along the horizon, thickest by the fence and thinning out.
  const blades = Math.round((120 * width) / REF_W);
  for (let i = 0; i < blades; i++) {
    const x = width * Math.pow(rand.next(), 1.6);
    const y = horizonY(x) + 0.4;
    const len = rand.range(3, x < 170 ? 11 : 8);
    const lean = rand.range(-0.45, 0.45);
    draw(
      `M${fmt(x)} ${fmt(y)}Q${fmt(x + Math.sin(lean) * len * 0.3)} ${fmt(y - len * 0.6)} ` +
        `${fmt(x + Math.sin(lean) * len)} ${fmt(y - Math.cos(lean) * len)}`,
      INK.grass,
      0.85,
    );
  }

  // Two plain poles: one mid-scene, one cut off at the right edge.
  const pole = (bx: number, h: number, lean: number) => {
    const by = horizonY(bx) + 0.5;
    draw(wobbly(bx, by, bx + lean, by - h, 0.5, 18), INK.pole, 1.8);
    return { bx, by, tx: bx + lean, ty: by - h };
  };
  const near = pole(width * 0.6, 168, 5);
  const edge = pole(width - 12, 190, -2);
  const onPole = (p: typeof near, k: number): Pt => [
    p.bx + (p.tx - p.bx) * k,
    p.by + (p.ty - p.by) * k,
  ];

  // Two wires in from off-screen left, across both poles, off to the right.
  [
    [1, 0],
    [0.95, 1],
  ].forEach(([k, i]) => {
    const a = onPole(near, k);
    const b = onPole(edge, k - 0.02);
    const left: Pt = [-50, a[1] - 16 + i * 5];
    const right: Pt = [width + 50, b[1] + 6];
    draw(
      `M${fmt(left[0])} ${fmt(left[1])}` +
        sag(left, a, 0.07) +
        sag(a, b, 0.06) +
        sag(b, right, 0.06),
      INK.wire,
      1,
    );
  });

  // Guy wire from near the top of the first pole down to the ground.
  const guy = onPole(near, 0.9);
  draw(wobbly(guy[0], guy[1], near.bx + 58, horizonY(near.bx + 58) + 0.3, 0.35, 16), INK.wire, 1);

  // A small broken fence on the left.
  const post = (x: number, h: number, lean: number) => {
    const by = horizonY(x) + 0.5;
    draw(wobbly(x, by, x + lean, by - h, 0.35, 8), INK.fence, 1.6);
    return { x, by, tx: x + lean, ty: by - h };
  };
  const onPost = (p: ReturnType<typeof post>, k: number): Pt => [
    p.x + (p.tx - p.x) * k,
    p.by + (p.ty - p.by) * k,
  ];
  const p0 = post(24, 32, -1);
  const p1 = post(62, 28, -2);
  const p2 = post(98, 14, 0);
  const p3 = post(136, 26, 6);
  // p2 is snapped off: a jagged top instead of a clean end.
  draw(
    `M${fmt(p2.tx - 2)} ${fmt(p2.ty + 1)}L${fmt(p2.tx)} ${fmt(p2.ty - 2)}` +
      `L${fmt(p2.tx + 1.2)} ${fmt(p2.ty + 2)}L${fmt(p2.tx + 2.6)} ${fmt(p2.ty - 0.8)}`,
    INK.fence,
    1.2,
  );
  let a = onPost(p0, 0.82);
  let b = onPost(p1, 0.82);
  draw(wobbly(a[0], a[1], b[0], b[1], 0.5, 8), INK.fence, 1.3);
  a = onPost(p0, 0.42);
  b = onPost(p1, 0.42);
  draw(wobbly(a[0], a[1], b[0], b[1], 0.5, 8), INK.fence, 1.3);
  // A plank fallen from p1 to the ground.
  a = onPost(p1, 0.78);
  draw(wobbly(a[0], a[1], p2.x - 7, horizonY(p2.x - 7) - 0.5, 0.5, 8), INK.fence, 1.3);
  // Slack wire past the broken post.
  a = onPost(p2, 0.6);
  b = onPost(p3, 0.55);
  draw(`M${fmt(a[0])} ${fmt(a[1])}` + sag(a, b, 0.18), INK.fenceWire, 0.9);
  // A rail stub snapped off in mid-air.
  a = onPost(p3, 0.85);
  draw(wobbly(a[0], a[1], a[0] - 15, a[1] + 3, 0.4, 6), INK.fence, 1.3);

  return { width, scenery: [...pools.values()], ...buildTumbleweed() };
}

// A loose tangle of curved twigs inside a slightly lumpy outline, with a few
// short spikes poking out.
function buildTumbleweed(): Pick<Scene, "tumbleweed" | "hull"> {
  const rand = seeded(TUMBLEWEED_SEED);
  const R = TUMBLEWEED_R;
  const N = 28;

  const raw = Array.from({ length: N }, () => R * rand.range(0.8, 1));
  const radii = raw.map((r, k) => (r + raw[(k + 1) % N] + raw[(k + N - 1) % N]) / 3);
  const radiusAt = (th: number) => {
    const u = ((((th / (2 * Math.PI)) % 1) + 1) % 1) * N;
    const k = Math.floor(u);
    const f = u - k;
    return radii[k] * (1 - f) + radii[(k + 1) % N] * f;
  };
  const inside = (m: number): Pt => {
    const th = rand.range(0, 2 * Math.PI);
    const r = radiusAt(th) * Math.sqrt(rand.next()) * m;
    return [Math.cos(th) * r, Math.sin(th) * r];
  };

  const twigs: string[] = [];
  for (let i = 0; i < 26; i++) {
    const p = inside(0.98);
    const q = inside(0.98);
    const c = inside(1.05);
    twigs.push(`M${fmt(p[0])} ${fmt(p[1])}Q${fmt(c[0])} ${fmt(c[1])} ${fmt(q[0])} ${fmt(q[1])}`);
  }

  const rims: string[] = [];
  for (let i = 0; i < 5; i++) {
    const start = rand.range(0, 2 * Math.PI);
    const pts: Pt[] = [];
    for (let j = 0; j < 6; j++) {
      const th = start + j * 0.42;
      const r = radiusAt(th) * rand.range(0.82, 0.98);
      pts.push([Math.cos(th) * r, Math.sin(th) * r]);
    }
    rims.push(smooth(pts));
  }

  const spikes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const th = rand.range(0, 2 * Math.PI);
    const r = radiusAt(th) * 0.9;
    const len = rand.range(3, 6);
    spikes.push(
      `M${fmt(Math.cos(th) * r)} ${fmt(Math.sin(th) * r)}` +
        `L${fmt(Math.cos(th + 0.05) * (r + len))} ${fmt(Math.sin(th + 0.05) * (r + len))}`,
    );
  }

  return {
    tumbleweed: [
      { d: twigs.join(""), stroke: INK.tumbleweed, width: 0.8 },
      { d: rims.join(""), stroke: INK.tumbleweed, width: 0.85 },
      { d: spikes.join(""), stroke: INK.tumbleweed, width: 0.7 },
    ],
    hull: radii.map((r, k): Pt => {
      const th = (k / N) * 2 * Math.PI;
      return [Math.cos(th) * r, Math.sin(th) * r];
    }),
  };
}

const SVG_NS = "http://www.w3.org/2000/svg";

function addPath(parent: Element, { d, stroke, width }: Stroke) {
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", d);
  path.setAttribute("stroke", stroke);
  path.setAttribute("stroke-width", String(width));
  parent.appendChild(path);
  return path;
}

// Draws the scene into `svg`, sized to it, and starts the tumbleweed rolling.
// Redraws when the element changes size and pauses while it's off-screen.
// Returns a cleanup function.
export function mountDesertScene(svg: SVGSVGElement): () => void {
  const still = prefersReducedMotion();

  let scene: Scene | null = null;
  let roller!: SVGGElement;
  let shadow!: SVGPathElement;
  // Design units per second; scaled so a pass takes a similar time on a
  // phone and on a wide monitor without spinning frantically on either.
  let speedScale = 1;

  let x = -50;
  let angle = 0;
  let lift = 0;
  let passTime = 0;
  let wait = 0;
  let hopIndex = 0;
  let hop: { t: number; duration: number; height: number; rebound: boolean } | null = null;

  const resetPass = () => {
    x = -50;
    angle = 0;
    lift = 0;
    passTime = 0;
    hopIndex = 0;
    hop = null;
  };

  const place = () => {
    if (!scene) return;
    // Rest the lowest point of the (not quite round) outline on the road.
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    let lowest = -Infinity;
    for (const [px, py] of scene.hull) lowest = Math.max(lowest, px * sin + py * cos);
    const ground = roadY(x);
    roller.setAttribute(
      "transform",
      `translate(${fmt(x)} ${fmt(ground - lowest + 0.6 - lift)}) rotate(${fmt((angle * 180) / Math.PI)})`,
    );
    // The shadow shrinks and fades while the tumbleweed is in the air.
    const spread = TUMBLEWEED_R * 1.05 * Math.max(0.35, 1 - lift / 22);
    const sy = ground + 1.5;
    const sx = x - 3;
    shadow.setAttribute(
      "d",
      `M${fmt(sx - spread)} ${fmt(sy)}Q${fmt(sx)} ${fmt(sy + 1.2)} ${fmt(sx + spread)} ${fmt(sy)}`,
    );
    shadow.setAttribute("opacity", fmt(Math.max(0.25, 1 - lift / 16)));
  };

  const draw = () => {
    const { width, height } = svg.getBoundingClientRect();
    if (!width || !height) return;
    const viewW = (width * VIEW_H) / height;
    scene = buildScene(viewW);
    speedScale = Math.pow(viewW / REF_W, 0.7);

    svg.setAttribute("viewBox", `0 0 ${fmt(viewW)} ${VIEW_H}`);
    svg.replaceChildren();
    for (const stroke of scene.scenery) addPath(svg, stroke);
    shadow = addPath(svg, { d: "", stroke: INK.shadow, width: 2.4 });
    roller = document.createElementNS(SVG_NS, "g");
    for (const stroke of scene.tumbleweed) addPath(roller, stroke);
    svg.appendChild(roller);

    if (still) {
      x = viewW * 0.4;
      angle = 0.5;
    } else {
      resetPass();
    }
    place();
  };

  const tick = (dt: number) => {
    if (!scene) return;
    if (wait > 0) {
      wait -= dt;
      return;
    }
    passTime += dt;
    const t = passTime;
    const v =
      100 *
      speedScale *
      (0.55 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.85 - 1.6)) + 0.18 * Math.sin(t * 2.6 + 1.3));
    x += v * dt;
    angle += (v * dt) / TUMBLEWEED_R;

    const next = HOPS[hopIndex];
    if (!hop && next && x >= scene.width * next.at) {
      hop = { t: 0, ...next };
      hopIndex++;
    }
    if (hop) {
      hop.t += dt;
      const p = hop.t / hop.duration;
      if (p >= 1) {
        lift = 0;
        hop = hop.rebound
          ? { t: 0, duration: hop.duration * 0.5, height: hop.height * 0.28, rebound: false }
          : null;
      } else {
        lift = hop.height * 4 * p * (1 - p);
      }
    }

    if (x > scene.width + 50) {
      resetPass();
      wait = PAUSE_BETWEEN_PASSES;
    }
    place();
  };

  let frame = 0;
  let last: number | null = null;
  let visible = false;

  const loop = (now: number) => {
    // Capped so a long gap (a backgrounded tab) doesn't teleport it.
    const dt = last === null ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    tick(dt);
    frame = requestAnimationFrame(loop);
  };
  const start = () => {
    if (still || frame || !visible) return;
    last = null;
    frame = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  // Only animate while the scene is on screen. One batch can hold several
  // changes, so the last entry is the current state.
  const io = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(svg);

  // The observer reports the size as soon as it starts watching, which makes
  // the first draw; later changes redraw to the new size (same seed, so the
  // same sketch, re-spaced).
  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    if (!scene) draw();
    else resizeTimer = window.setTimeout(draw, 150);
  });
  ro.observe(svg);

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    clearTimeout(resizeTimer);
    svg.replaceChildren();
  };
}
