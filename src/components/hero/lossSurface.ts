/**
 * A random loss surface as a 3D landscape. Its contour lines are computed per
 * pixel in the shader and read as wood grain; three narrow wells, the knots
 * in the wood, are local minima. A point runs gradient descent with momentum
 * across it. When it has settled, the surface turns into a new one and the
 * next descent starts.
 *
 * Loaded on the start page only (see Hero.tsx), so three.js is not part of
 * the other pages.
 */
import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  type InterleavedBufferAttribute,
} from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const STEPS_PER_SECOND = 24;
const LEARNING_RATE = 0.04;
const MOMENTUM = 0.9;
const MAX_STEPS = 600;
const HOLD = 3.2; // seconds the result stays before the surface changes
const MORPH = 2.4; // seconds for one surface to turn into the next
const LEVELS = 40; // contour lines on the board
const EXTRA_LEVELS = 24; // more beyond it, with the same spacing
const LEVEL_COUNT = LEVELS + EXTRA_LEVELS;
const SEARCH_STEPS = Math.ceil(Math.log2(LEVEL_COUNT));
const INDEX_EVERY = 5; // every fifth line darker, as on a topographic map
const LINE_WIDTH = 1; // contour lines, in CSS pixels; colours in global.css
const RELIEF = 0.28; // height = RELIEF · tanh(1.8 · loss)
const MARGIN = 1.2; // surface beyond the board, so its edge never shows
const MESH_STEP = 0.008; // mesh resolution in field units
const FOV = 30;
const ELEVATION = MathUtils.degToRad(40); // camera angle above the ground

// ----- Loss surface -----

type Point = [number, number];

interface Wave {
  amp: number;
  freq: number;
  phase: number;
}

interface Knot {
  u: number;
  w: number;
  s: number; // width
  d: number; // depth
}

interface Surface {
  cu: number; // centre of the bowl
  cw: number;
  a: number; // curvature along the grain
  b: number; // and across it
  waves: Wave[];
  knots: Knot[];
}

/**
 * Field coordinates: u runs from left to right, w from the back of the board
 * to the front, both in units of the hero's height. The board is the part
 * the camera frames: u ∈ [0, width / height], w ∈ [0, 1]. So every screen
 * sees the landscape at the same scale, with the grain running across; a
 * phone simply shows a narrower piece of it.
 */
interface Board {
  width: number; // hero in CSS pixels
  height: number;
  length: number; // width / height
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const heightOf = (f: number) => RELIEF * Math.tanh(1.8 * f);

/** A point on the board, given as a fraction of its width and depth. */
function fromFraction(board: Board, fx: number, fy: number): Point {
  return [fx * board.length, fy];
}

function toWorld(board: Board, u: number, w: number, y: number, out: Vector3) {
  return out.set(u - board.length / 2, y, w - 0.5);
}

function fromWorld(board: Board, x: number, z: number): Point {
  return [x + board.length / 2, z + 0.5];
}

/**
 * A long, shallow bowl with a wavy valley (the grain) and narrow Gaussian
 * wells (the knots): three on wide screens, two on narrow ones. Each knot is
 * a local minimum. Everything sits on the visible board, in its back part,
 * away from the name.
 */
function makeSurface(board: Board): Surface {
  const count = board.length < 1 ? 2 : 3;
  const [cu, cw] = fromFraction(board, rand(0.3, 0.7), rand(0.28, 0.5));
  const waves = [
    { amp: rand(0.025, 0.05), freq: rand(1.6, 2.6), phase: rand(0, 2 * Math.PI) },
    { amp: rand(0.01, 0.025), freq: rand(3.5, 5.5), phase: rand(0, 2 * Math.PI) },
    { amp: rand(0.004, 0.01), freq: rand(8, 12), phase: rand(0, 2 * Math.PI) },
  ];
  const knots: Knot[] = [];
  for (let tries = 0; knots.length < count && tries < 60; tries++) {
    const [u, w] = fromFraction(board, rand(0.1, 0.9), rand(0.1, 0.62));
    if (knots.some((k) => Math.hypot(k.u - u, k.w - w) < 0.28)) continue;
    const s = rand(0.04, 0.07);
    knots.push({ u, w, s, d: s * s * rand(22, 36) });
  }
  // Always three, so two surfaces can be blended knot by knot.
  while (knots.length < 3) knots.push({ ...knots[0], d: 0 });
  return { cu, cw, a: rand(0.05, 0.09), b: rand(0.9, 1.3), waves, knots };
}

function lerpSurface(A: Surface, B: Surface, t: number): Surface {
  return {
    cu: mix(A.cu, B.cu, t),
    cw: mix(A.cw, B.cw, t),
    a: mix(A.a, B.a, t),
    b: mix(A.b, B.b, t),
    waves: A.waves.map((q, i) => ({
      amp: mix(q.amp, B.waves[i].amp, t),
      freq: mix(q.freq, B.waves[i].freq, t),
      phase: mix(q.phase, B.waves[i].phase, t),
    })),
    knots: A.knots.map((k, i) => ({
      u: mix(k.u, B.knots[i].u, t),
      w: mix(k.w, B.knots[i].w, t),
      s: mix(k.s, B.knots[i].s, t),
      d: mix(k.d, B.knots[i].d, t),
    })),
  };
}

/** Same formula as lossAt() in the shader below. */
function loss(P: Surface, u: number, w: number) {
  let wave = 0;
  for (const q of P.waves) wave += q.amp * Math.sin(q.freq * u + q.phase);
  const du = u - P.cu;
  const dw = w - P.cw + wave;
  let f = P.a * du * du + P.b * dw * dw;
  for (const k of P.knots) {
    const x = u - k.u;
    const y = w - k.w;
    f -= k.d * Math.exp(-(x * x + y * y) / (2 * k.s * k.s));
  }
  return f;
}

function gradient(P: Surface, u: number, w: number): Point {
  let wave = 0;
  let slope = 0;
  for (const q of P.waves) {
    wave += q.amp * Math.sin(q.freq * u + q.phase);
    slope += q.amp * q.freq * Math.cos(q.freq * u + q.phase);
  }
  const du = u - P.cu;
  const dw = w - P.cw + wave;
  let gu = 2 * P.a * du + 2 * P.b * dw * slope;
  let gw = 2 * P.b * dw;
  for (const k of P.knots) {
    const x = u - k.u;
    const y = w - k.w;
    const e = (k.d * Math.exp(-(x * x + y * y) / (2 * k.s * k.s))) / (k.s * k.s);
    gu += e * x;
    gw += e * y;
  }
  return [gu, gw];
}

/** Lowest value of the surface: plain descent from the bowl and each knot. */
function lowestLoss(P: Surface) {
  let best = Infinity;
  const starts: Point[] = [[P.cu, P.cw], ...P.knots.map((k): Point => [k.u, k.w])];
  for (const [u0, w0] of starts) {
    let u = u0;
    let w = w0;
    for (let i = 0; i < 4000; i++) {
      const [gu, gw] = gradient(P, u, w);
      u -= 0.01 * gu;
      w -= 0.01 * gw;
    }
    best = Math.min(best, loss(P, u, w));
  }
  return best;
}

/** The highest of a few random points in the upper part of the hero. */
function pickStart(P: Surface, board: Board): Point {
  let best = fromFraction(board, 0.5, 0.2);
  let top = -Infinity;
  for (let i = 0; i < 8; i++) {
    const point = fromFraction(board, rand(0.06, 0.94), rand(0.08, 0.55));
    const f = loss(P, point[0], point[1]);
    if (f > top) {
      top = f;
      best = point;
    }
  }
  return best;
}

/**
 * Contour levels at squared quantiles of the board: the area inside each
 * line grows with the square of its number, so the rings come out evenly
 * spaced, like growth rings, and a small knot only gets a few of them.
 * Beyond the board the spacing simply continues.
 */
function computeLevels(P: Surface, board: Board, samples: number, out: Float32Array) {
  // `samples` points along the longer side of the board.
  const nu = Math.max(8, Math.round(samples * Math.min(1, board.length)));
  const nw = Math.max(8, Math.round(samples / Math.max(1, board.length)));
  const values = new Float32Array(nu * nw);
  for (let j = 0; j < nw; j++) {
    for (let i = 0; i < nu; i++) {
      values[j * nu + i] = loss(P, ((i + 0.5) / nu) * board.length, (j + 0.5) / nw);
    }
  }
  values.sort();
  for (let k = 0; k < LEVELS; k++) {
    out[k] = values[Math.min(values.length - 1, Math.floor(((k + 0.5) / LEVELS) ** 2 * values.length))];
  }
  const base = values[0];
  const radius = (x: number) => Math.sqrt(Math.max(0, x - base));
  const top = radius(out[LEVELS - 1]);
  const step = Math.max(1e-4, (top - radius(out[LEVELS - 21])) / 20);
  for (let k = LEVELS; k < LEVEL_COUNT; k++) {
    const r = top + (k - LEVELS + 1) * step;
    out[k] = base + r * r;
  }
}

// ----- Shaders -----

const LOSS_GLSL = /* glsl */ `
  uniform vec4 uBowl;     // centre u, centre w, a, b
  uniform vec3 uWaves[3]; // amplitude, frequency, phase
  uniform vec4 uKnots[3]; // u, w, width, depth

  float lossAt(vec2 p) {
    float wave = 0.0;
    for (int i = 0; i < 3; i++) wave += uWaves[i].x * sin(uWaves[i].y * p.x + uWaves[i].z);
    vec2 d = vec2(p.x - uBowl.x, p.y - uBowl.y + wave);
    float f = uBowl.z * d.x * d.x + uBowl.w * d.y * d.y;
    for (int i = 0; i < 3; i++) {
      vec2 k = p - uKnots[i].xy;
      f -= uKnots[i].w * exp(-dot(k, k) / (2.0 * uKnots[i].z * uKnots[i].z));
    }
    return f;
  }
`;

const VERTEX = /* glsl */ `
  ${LOSS_GLSL}
  uniform vec2 uCenter;
  uniform float uRelief;
  varying vec2 vField;
  varying float vDistance;

  void main() {
    vec2 p = position.xy; // field coordinates (u, w)
    float h = uRelief * tanh(1.8 * lossAt(p));
    vec3 world = vec3(p.x - uCenter.x, h, p.y - uCenter.y);
    vField = p;
    vec4 view = modelViewMatrix * vec4(world, 1.0);
    vDistance = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

// Each pixel finds the nearest contour level (binary search) and draws a
// line of constant screen width, antialiased with the screen-space gradient.
// Lines fade where they would crowd into moiré, in the distance, and towards
// the bottom of the hero, where the name sits.
const FRAGMENT = /* glsl */ `
  ${LOSS_GLSL}
  uniform float uLevels[${LEVEL_COUNT}];
  uniform vec3 uBg;
  uniform vec3 uLine;
  uniform vec3 uIndex;
  uniform float uHalf;
  uniform vec2 uFog;
  uniform float uRes;
  varying vec2 vField;
  varying float vDistance;

  void main() {
    float f = lossAt(vField);
    float perPx = max(length(vec2(dFdx(f), dFdy(f))), 1e-7);

    int lo = 0;
    int hi = ${LEVEL_COUNT - 1};
    for (int i = 0; i < ${SEARCH_STEPS}; i++) {
      int mid = (lo + hi) / 2;
      if (uLevels[mid] < f) lo = mid + 1; else hi = mid;
    }
    int k = min(lo, ${LEVEL_COUNT - 1});
    if (k > 0 && f - uLevels[k - 1] < abs(uLevels[k] - f)) k -= 1;

    float dist = abs(uLevels[k] - f) / perPx;
    float spacing = 0.5 * (uLevels[min(k + 1, ${LEVEL_COUNT - 1})] - uLevels[max(k - 1, 0)]) / perPx;

    float a = clamp(uHalf + 0.5 - dist, 0.0, 1.0);
    a *= smoothstep(1.5, 4.0, spacing);
    a *= 1.0 - 0.6 * smoothstep(uFog.x, uFog.y, vDistance);
    a *= 1.0 - smoothstep(uFog.y, uFog.y * 1.5, vDistance); // gone towards the horizon
    a *= mix(0.4, 1.0, smoothstep(0.0, 0.5, gl_FragCoord.y / uRes));

    bool major = k - (k / ${INDEX_EVERY}) * ${INDEX_EVERY} == ${INDEX_EVERY - 1};
    gl_FragColor = vec4(mix(uBg, major ? uIndex : uLine, a), 1.0);
    #include <colorspace_fragment>
  }
`;

// ----- Scene -----

export interface LossSurfaceUi {
  /** Placed on the minimum once the descent has settled; holds a <span> for the label. */
  marker: HTMLElement;
}

/**
 * Draws the scene into `container` and keeps `ui` up to date. Returns a
 * function that stops everything and frees the GPU, or null without WebGL.
 */
export function mountLossSurface(container: HTMLElement, ui: LossSurfaceUi): (() => void) | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null; // no WebGL: the start page shows the name only
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Reduced motion: one finished descent as a still picture.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // With a mouse, a click starts a descent and the camera follows the
  // pointer. On touch screens the surfaces simply follow one another.
  const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const markerLabel = ui.marker.querySelector('span');
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.01, 50);
  const board: Board = { width: 0, height: 0, length: 1 };
  let distance = 2; // camera distance, fitted to the hero on resize
  let pixel = 0.001; // world units per CSS pixel at the centre
  let builtLength = 0; // board length the mesh was built for
  let madeLength = 0; // board length the current surface was made for

  const uniforms = {
    uBowl: { value: new Vector4() },
    uWaves: { value: [new Vector3(), new Vector3(), new Vector3()] },
    uKnots: { value: [new Vector4(), new Vector4(), new Vector4()] },
    uCenter: { value: new Vector2() },
    uRelief: { value: RELIEF },
    uLevels: { value: new Float32Array(LEVEL_COUNT) },
    uBg: { value: new Color() },
    uLine: { value: new Color() },
    uIndex: { value: new Color() },
    uHalf: { value: 0.5 },
    uFog: { value: new Vector2(2, 3) },
    uRes: { value: 1 },
  };

  const surfaceMaterial = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    side: DoubleSide,
  });
  const surface = new Mesh(new BufferGeometry(), surfaceMaterial);
  surface.frustumCulled = false;

  // Path through the iterates: a line of constant screen width.
  const trailGeometry = new LineGeometry();
  trailGeometry.setPositions(new Float32Array((MAX_STEPS + 2) * 3));
  const trailBuffer = (trailGeometry.attributes.instanceStart as InterleavedBufferAttribute).data;
  const trailMaterial = new LineMaterial({ linewidth: 1.25, transparent: true, depthTest: false });
  const trail = new Line2(trailGeometry, trailMaterial);
  trail.frustumCulled = false;
  trail.renderOrder = 2;

  // Each iterate as a small dot: their spacing shows the step size.
  const inkMaterial = new MeshBasicMaterial({ transparent: true, depthTest: false });
  const dotGeometry = new SphereGeometry(1, 10, 8);
  const dots = new InstancedMesh(dotGeometry, inkMaterial, MAX_STEPS + 2);
  dots.frustumCulled = false;
  dots.renderOrder = 3;
  dots.count = 0;

  // The moving point and a thin ring around it, both facing the camera.
  const ballGeometry = new CircleGeometry(1, 48);
  const ball = new Mesh(ballGeometry, inkMaterial);
  ball.renderOrder = 5;
  const haloGeometry = new RingGeometry(0.89, 1, 64);
  const haloMaterial = new MeshBasicMaterial({ transparent: true, depthTest: false });
  const halo = new Mesh(haloGeometry, haloMaterial);
  halo.renderOrder = 4;

  // Start: an open circle.
  const paperMaterial = new MeshBasicMaterial({ transparent: true, depthTest: false });
  const startFillGeometry = new CircleGeometry(0.72, 48);
  const startRingGeometry = new RingGeometry(0.72, 1, 48);
  const startFill = new Mesh(startFillGeometry, paperMaterial);
  const startRing = new Mesh(startRingGeometry, inkMaterial);
  startFill.renderOrder = 6;
  startRing.renderOrder = 7;
  const start = new Group();
  start.add(startFill, startRing);

  scene.add(surface, trail, dots, halo, ball, start);

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    const bg = token('--color-bg', '#ffffff');
    const ink = token('--color-text', '#111111');
    uniforms.uBg.value.set(bg);
    uniforms.uLine.value.set(token('--color-contour', '#cdcdcd'));
    uniforms.uIndex.value.set(token('--color-contour-index', '#a8a8a8'));
    trailMaterial.color.set(ink);
    inkMaterial.color.set(ink);
    haloMaterial.color.set(token('--color-text-muted', '#666666'));
    paperMaterial.color.set(bg);
  }

  /** Grid over the board plus a margin, in field coordinates. */
  function buildMesh() {
    builtLength = board.length;
    const u0 = -MARGIN;
    const u1 = board.length + MARGIN;
    const w0 = -MARGIN;
    const w1 = 1 + MARGIN;
    const nu = Math.ceil((u1 - u0) / MESH_STEP);
    const nw = Math.ceil((w1 - w0) / MESH_STEP);
    const positions = new Float32Array((nu + 1) * (nw + 1) * 3);
    let p = 0;
    for (let j = 0; j <= nw; j++) {
      for (let i = 0; i <= nu; i++) {
        positions[p++] = u0 + ((u1 - u0) * i) / nu;
        positions[p++] = w0 + ((w1 - w0) * j) / nw;
        positions[p++] = 0;
      }
    }
    const index = new Uint32Array(nu * nw * 6);
    let q = 0;
    for (let j = 0; j < nw; j++) {
      for (let i = 0; i < nu; i++) {
        const a = j * (nu + 1) + i;
        const c = a + nu + 1;
        index.set([a, c, a + 1, a + 1, c, c + 1], q);
        q += 6;
      }
    }
    surface.geometry.dispose();
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setIndex(new BufferAttribute(index, 1));
    surface.geometry = geometry;
  }

  function applySurface(Q: Surface, samples: number) {
    uniforms.uBowl.value.set(Q.cu, Q.cw, Q.a, Q.b);
    Q.waves.forEach((q, i) => uniforms.uWaves.value[i].set(q.amp, q.freq, q.phase));
    Q.knots.forEach((k, i) => uniforms.uKnots.value[i].set(k.u, k.w, k.s, k.d));
    computeLevels(Q, board, samples, uniforms.uLevels.value);
  }

  // ----- Camera -----

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const born = performance.now();

  /**
   * Distance at which the whole board fits; the margin fills the rest. As the
   * board is as wide as the screen is in proportion, this comes out the same
   * on every screen, so the landscape keeps its scale.
   */
  function fitCamera() {
    camera.aspect = board.width / board.height;
    camera.updateProjectionMatrix();
    const t = Math.tan(MathUtils.degToRad(FOV / 2));
    distance = Math.max(
      ((board.length / 2) * 0.94) / (t * camera.aspect),
      (Math.sin(ELEVATION) / (2 * t)) * 0.94,
    );
    pixel = (2 * distance * t) / board.height;
    uniforms.uFog.value.set(distance, distance * 1.6);
  }

  function placeCamera(now: number) {
    pointer.x += (pointer.targetX - pointer.x) * 0.04;
    pointer.y += (pointer.targetY - pointer.y) * 0.04;
    const sway = still ? 0 : Math.sin(((now - born) / 1000) * 0.08) * 0.05;
    const azimuth = sway + pointer.x * 0.08;
    const elevation = ELEVATION - pointer.y * 0.04;
    camera.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * distance,
      Math.sin(elevation) * distance,
      Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.lookAt(0, 0, 0);
  }

  // ----- Descent -----

  let P: Surface | null = null; // current surface
  let from: Surface | null = null; // the two surfaces while changing
  let to: Surface | null = null;
  let floor = 0; // lowest loss of the current surface
  let path: Point[] = []; // iterates in field coordinates
  let velocity: Point = [0, 0];
  let phase: 'descend' | 'settled' | 'morph' = 'descend';
  let clock = 0; // seconds in the current phase
  let progress = 0; // fraction of the next step, for smooth motion
  let pending: Point | null = null; // start point clicked while the surface was changing

  const head = () => path[path.length - 1];

  function startDescent(point: Point) {
    path = [point];
    velocity = [0, 0];
    phase = 'descend';
    clock = 0;
    progress = 0;
  }

  function settle(converged: boolean) {
    if (!P) return;
    phase = 'settled';
    clock = 0;
    progress = 0;
    const [u, w] = head();
    let result = 'stopped';
    if (converged) result = loss(P, u, w) - floor < 2e-3 ? 'global minimum' : 'local minimum';
    if (markerLabel) markerLabel.textContent = result;
  }

  /** One step of gradient descent with momentum (heavy ball). */
  function step() {
    if (!P) return;
    const [u, w] = head();
    const [gu, gw] = gradient(P, u, w);
    velocity = [MOMENTUM * velocity[0] - LEARNING_RATE * gu, MOMENTUM * velocity[1] - LEARNING_RATE * gw];
    path.push([u + velocity[0], w + velocity[1]]);
    const moving = Math.hypot(velocity[0], velocity[1]) * board.height; // about CSS pixels per step
    if (moving < 0.12 && Math.hypot(gu, gw) < 3e-3) settle(true);
    else if (path.length > MAX_STEPS) settle(false);
  }

  function newSurface() {
    madeLength = board.length;
    P = makeSurface(board);
    floor = lowestLoss(P);
    applySurface(P, 160);
  }

  function runToEnd(point: Point) {
    startDescent(point);
    while (phase === 'descend') step();
  }

  /** Where a click lands on the surface: march along the ray, then bisect. */
  const raycaster = new Raycaster();
  const probe = new Vector3();
  function pick(clientX: number, clientY: number): Point | null {
    if (!P) return null;
    const surfaceNow = P;
    const box = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(
      new Vector2(((clientX - box.left) / box.width) * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1),
      camera,
    );
    const { origin, direction } = raycaster.ray;
    const above = (t: number) => {
      probe.copy(origin).addScaledVector(direction, t);
      const [u, w] = fromWorld(board, probe.x, probe.z);
      return probe.y - heightOf(loss(surfaceNow, u, w));
    };
    let near = 0;
    let far = -1;
    for (let t = 0.02; t < distance * 4; t += 0.01) {
      if (above(t) <= 0) {
        far = t;
        near = t - 0.01;
        break;
      }
    }
    if (far < 0) return null;
    for (let i = 0; i < 24; i++) {
      const middle = (near + far) / 2;
      if (above(middle) > 0) near = middle;
      else far = middle;
    }
    probe.copy(origin).addScaledVector(direction, far);
    const [u, w] = fromWorld(board, probe.x, probe.z);
    return [clamp(u, 0.02, board.length - 0.02), clamp(w, 0.02, 0.98)];
  }

  // ----- Drawing -----

  const world: Vector3[] = [];
  const tip = new Vector3();
  const matrix = new Matrix4();
  const projected = new Vector3();

  function worldPoint(i: number) {
    if (!world[i]) world[i] = new Vector3();
    const [u, w] = path[i];
    return toWorld(board, u, w, P ? heightOf(loss(P, u, w)) : 0, world[i]);
  }

  function draw(now: number) {
    if (!P) return;
    placeCamera(now);

    const alpha = phase === 'morph' ? Math.max(0, 1 - clock / (MORPH * 0.4)) : 1;
    const visible = alpha > 0 && path.length > 0;
    trail.visible = dots.visible = start.visible = visible;
    ball.visible = halo.visible = visible && phase === 'descend';
    trailMaterial.opacity = alpha;
    inkMaterial.opacity = alpha;
    haloMaterial.opacity = alpha;
    paperMaterial.opacity = alpha;

    if (visible) {
      const n = path.length;
      for (let i = 0; i < n; i++) worldPoint(i);
      const moving = phase === 'descend' && n > 1;
      const reached = moving ? n - 1 : n; // iterates the point has already passed
      tip.copy(world[n - 1]);
      if (moving) tip.lerpVectors(world[n - 2], world[n - 1], progress);

      // Line segments: start and end point per segment, six floats each.
      const array = trailBuffer.array;
      let segments = 0;
      const put = (v: Vector3, offset: number) => {
        array[offset] = v.x;
        array[offset + 1] = v.y;
        array[offset + 2] = v.z;
      };
      for (let i = 0; i < reached - 1; i++, segments++) {
        put(world[i], segments * 6);
        put(world[i + 1], segments * 6 + 3);
      }
      if (moving) {
        put(world[reached - 1], segments * 6);
        put(tip, segments * 6 + 3);
        segments++;
      }
      trailBuffer.needsUpdate = true;
      trailGeometry.instanceCount = segments;

      const r = 1.6 * pixel;
      dots.count = Math.max(0, reached - 1);
      for (let i = 1; i < reached; i++) dots.setMatrixAt(i - 1, matrix.makeScale(r, r, r).setPosition(world[i]));
      dots.instanceMatrix.needsUpdate = true;

      start.position.copy(world[0]);
      start.scale.setScalar(4.5 * pixel);
      ball.position.copy(tip);
      ball.scale.setScalar(4.5 * pixel);
      halo.position.copy(tip);
      halo.scale.setScalar(9 * pixel);
      for (const object of [start, ball, halo]) object.quaternion.copy(camera.quaternion);
    }

    renderer.render(scene, camera);

    // End: a cross and what was found there, in HTML so the type stays crisp.
    if (phase === 'descend' || !path.length) {
      ui.marker.style.opacity = '0';
    } else {
      projected.copy(worldPoint(path.length - 1)).project(camera);
      const x = ((projected.x + 1) / 2) * board.width;
      const y = ((1 - projected.y) / 2) * board.height;
      ui.marker.style.transform = `translate(${x}px, ${y}px)`;
      ui.marker.toggleAttribute('data-flip', x > board.width - 180);
      ui.marker.style.opacity = String(phase === 'settled' ? Math.min(1, clock / 0.4) : alpha);
    }
  }

  // ----- Running -----

  let frame = 0;
  let last = performance.now();

  function tick(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;

    if (phase === 'descend') {
      progress += dt * STEPS_PER_SECOND;
      while (progress >= 1 && phase === 'descend') {
        step();
        progress -= 1;
      }
    } else if (phase === 'settled') {
      if (clock >= HOLD && P) {
        from = P;
        madeLength = board.length;
        to = makeSurface(board);
        phase = 'morph';
        clock = 0;
      }
    } else if (from && to) {
      const t = Math.min(1, clock / MORPH);
      if (t >= 1) {
        P = to;
        floor = lowestLoss(P);
        applySurface(P, 160);
        startDescent(pending ?? pickStart(P, board));
        pending = null;
      } else {
        P = lerpSurface(from, to, t * t * (3 - 2 * t));
        applySurface(P, 90);
      }
    }

    draw(now);
    frame = requestAnimationFrame(tick);
  }

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height || (width === board.width && height === board.height)) return;
    board.width = width;
    board.height = height;
    board.length = width / height;

    renderer.setSize(width, height);
    trailMaterial.resolution.set(width, height);
    const ratio = renderer.getPixelRatio();
    uniforms.uRes.value = height * ratio;
    uniforms.uHalf.value = 0.5 * LINE_WIDTH * ratio; // half the line width in device pixels
    uniforms.uCenter.value.set(board.length / 2, 0.5);
    // The mesh covers [-MARGIN, builtLength + MARGIN]; rebuild when that no longer fits.
    if (board.length > builtLength || board.length < builtLength - 0.5) buildMesh();
    fitCamera();

    // A new surface when the board changed a lot (a phone turned sideways),
    // so the knots stay on screen.
    if (!P || Math.abs(board.length - madeLength) > 0.25 * madeLength) {
      newSurface();
      if (P && still) runToEnd(pickStart(P, board));
      else if (P) startDescent(pickStart(P, board));
    } else if (P) {
      applySurface(P, phase === 'morph' ? 90 : 160);
    }
    draw(performance.now());
  }

  const onClick = (event: MouseEvent) => {
    const point = pick(event.clientX, event.clientY);
    if (!point) return;
    if (still) {
      runToEnd(point);
      draw(performance.now());
    } else if (phase === 'morph') {
      pending = point;
    } else {
      startDescent(point);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
  };

  const resizeObserver = new ResizeObserver(resize);
  // Follow the light/dark switch.
  const themeObserver = new MutationObserver(() => {
    readColors();
    draw(performance.now());
  });

  readColors();
  resize();
  resizeObserver.observe(container);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (mouse) container.addEventListener('click', onClick);

  if (!still) {
    if (mouse) window.addEventListener('pointermove', onPointerMove);
    frame = requestAnimationFrame((now) => {
      last = now;
      tick(now);
    });
  }

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('click', onClick);
    resizeObserver.disconnect();
    themeObserver.disconnect();
    for (const geometry of [
      surface.geometry,
      trailGeometry,
      dotGeometry,
      ballGeometry,
      haloGeometry,
      startFillGeometry,
      startRingGeometry,
    ]) {
      geometry.dispose();
    }
    for (const material of [surfaceMaterial, trailMaterial, inkMaterial, haloMaterial, paperMaterial]) {
      material.dispose();
    }
    dots.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
