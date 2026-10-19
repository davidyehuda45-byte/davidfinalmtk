// Engine grafik fungsi: animasi progresif, zoom, pan, tooltip, titik penting.
// Tanpa library eksternal agar tetap offline.
import { buildFunction, classifyFunction } from "./calculator.js";

export const INK = "#202522";
export const PAPER = "#FFFDF7";
export const GRID_LINE = "#D8D4C9";
export const MUTED = "#6F756F";

function round2(n) {
  return Math.round(n * 100) / 100;
}

/** Langkah tick yang enak dibaca untuk rentang tertentu (1-2-5). */
export function niceStep(span, target = 10) {
  if (!isFinite(span) || span <= 0) return 1;
  const raw = span / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const s = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  return s * mag;
}

export function fmtTick(v, step) {
  const dec = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  const r = Number(v.toFixed(dec));
  return Object.is(r, -0) ? "0" : String(r);
}

/** Titik penting untuk ditandai pada grafik. */
export function computeKeyPoints(exprRaw) {
  try {
    const info = classifyFunction(exprRaw);
    const pts = [];
    if (info.type === "linear") {
      if (isFinite(info.yInt)) pts.push({ x: 0, y: info.yInt, label: `(0, ${info.yInt})` });
      if (info.xRoot !== undefined && isFinite(info.xRoot))
        pts.push({ x: info.xRoot, y: 0, label: `(${info.xRoot}, 0)` });
    } else if (info.type === "quadratic") {
      pts.push({ x: info.vertex.x, y: info.vertex.y, label: `puncak (${info.vertex.x}, ${info.vertex.y})` });
      for (const r of info.roots) pts.push({ x: r, y: 0, label: `(${r}, 0)` });
      pts.push({ x: 0, y: info.yInt, label: `(0, ${info.yInt})` });
    } else {
      if (info.yInt !== null && isFinite(info.yInt))
        pts.push({ x: 0, y: info.yInt, label: `(0, ${info.yInt})` });
      for (const r of info.roots.slice(0, 3)) pts.push({ x: r, y: 0, label: `(${r}, 0)` });
    }
    return { type: info.type, points: pts, info };
  } catch {
    return { type: "other", points: [], info: null };
  }
}

/**
 * Membuat plot interaktif pada sebuah <canvas>.
 * Seri: [{ expr, color, dash, fn, key }]
 */
export function createFunctionPlot(canvas) {
  const ctx = canvas.getContext("2d");
  const state = {
    series: [],
    viewport: { xmin: -10, xmax: 10, ymin: -10, ymax: 10 },
    defaults: { xmin: -10, xmax: 10, ymin: -10, ymax: 10 },
    showGrid: true,
    showNumbers: true,
    showAxes: true,
    showPoints: true,
    axisFont: 11,
    progress: 1,
  };
  let raf = 0;
  let animState = "idle"; // idle | playing | paused | done
  let animT0 = 0;
  let animElapsed = 0;
  let animDur = 1300;
  let onHoverCb = null;
  let onViewportCb = null;
  let onStateCb = null;
  let hover = null;
  let ro = null;

  const emitState = () => {
    if (onStateCb) onStateCb(animState);
  };

  const W = () => canvas.clientWidth || 600;
  const H = () => canvas.clientHeight || 320;
  const V = () => state.viewport;
  const xToPx = (x, w) => ((x - V().xmin) / (V().xmax - V().xmin)) * w;
  const yToPx = (y, h) => h - ((y - V().ymin) / (V().ymax - V().ymin)) * h;
  const pxToX = (px, w) => V().xmin + (px / w) * (V().xmax - V().xmin);
  const pxToY = (py, h) => V().ymin + ((h - py) / h) * (V().ymax - V().ymin);

  function setup() {
    const dpr = window.devicePixelRatio || 1;
    const w = W();
    const h = H();
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  function draw() {
    const { w, h } = setup();
    const { xmin, xmax, ymin, ymax } = V();
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);

    const xStep = niceStep(xmax - xmin);
    const yStep = niceStep(ymax - ymin);
    const x0px = xToPx(0, w);
    const y0px = yToPx(0, h);
    const y0vis = y0px >= 0 && y0px <= h;
    const x0vis = x0px >= 0 && x0px <= w;

    // --- grid ---
    if (state.showGrid) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = GRID_LINE;
      const xStart = Math.ceil(xmin / xStep) * xStep;
      for (let gx = xStart; gx <= xmax + 1e-9; gx += xStep) {
        const px = xToPx(gx, w);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
      }
      const yStart = Math.ceil(ymin / yStep) * yStep;
      for (let gy = yStart; gy <= ymax + 1e-9; gy += yStep) {
        const py = yToPx(gy, h);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
      }
    }

    // --- sumbu ---
    if (state.showAxes) {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6;
      if (y0vis) {
        ctx.beginPath();
        ctx.moveTo(0, y0px);
        ctx.lineTo(w, y0px);
        ctx.stroke();
      }
      if (x0vis) {
        ctx.beginPath();
        ctx.moveTo(x0px, 0);
        ctx.lineTo(x0px, h);
        ctx.stroke();
      }
      // panah + label X/Y
      ctx.fillStyle = INK;
      ctx.font = `700 ${state.axisFont}px 'Space Grotesk', system-ui, sans-serif`;
      if (y0vis) ctx.fillText("X →", w - 26, Math.min(Math.max(y0px - 6, 12), h - 4));
      if (x0vis) ctx.fillText("Y ↑", Math.min(Math.max(x0px + 6, 4), w - 30), 14);
      // titik pusat
      if (x0vis && y0vis) {
        ctx.beginPath();
        ctx.arc(x0px, y0px, 3, 0, Math.PI * 2);
        ctx.fillStyle = INK;
        ctx.fill();
      }
    }

    // --- angka ---
    if (state.showNumbers) {
      ctx.fillStyle = MUTED;
      ctx.font = `${state.axisFont}px Inter, system-ui, sans-serif`;
      const xStart = Math.ceil(xmin / xStep) * xStep;
      for (let gx = xStart; gx <= xmax + 1e-9; gx += xStep) {
        if (Math.abs(gx) < 1e-9) continue; // 0 sudah diwakili titik pusat
        const px = xToPx(gx, w);
        const labelY = y0vis ? Math.min(Math.max(y0px + 14, 12), h - 4) : h - 6;
        ctx.fillText(fmtTick(gx, xStep), px - 8, labelY);
      }
      const yStart = Math.ceil(ymin / yStep) * yStep;
      for (let gy = yStart; gy <= ymax + 1e-9; gy += yStep) {
        if (Math.abs(gy) < 1e-9) continue;
        const py = yToPx(gy, h);
        if (py < 8 || py > h - 2) continue;
        const labelX = x0vis ? Math.min(Math.max(x0px + 4, 4), w - 24) : 4;
        ctx.fillText(fmtTick(gy, yStep), labelX, py - 3);
      }
    }

    // --- kurva (progresif kiri → kanan) ---
    const xEnd = xmin + (xmax - xmin) * state.progress;
    for (const s of state.series) {
      if (!s.fn) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2.6;
      ctx.lineJoin = "round";
      ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      let started = false;
      const steps = Math.max(240, Math.floor(w));
      for (let i = 0; i <= steps; i++) {
        const x = xmin + ((xEnd - xmin) * i) / steps;
        let y;
        try {
          y = s.fn(x);
        } catch {
          started = false;
          continue;
        }
        if (typeof y !== "number" || !isFinite(y)) {
          started = false;
          continue;
        }
        if (y < ymin - (ymax - ymin) || y > ymax + (ymax - ymin)) {
          started = false;
          continue;
        }
        const px = xToPx(x, w);
        const py = yToPx(y, h);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // --- titik penting ---
    if (state.showPoints) {
      state.series.forEach((s, si) => {
        if (!s.key) return;
        s.key.points.forEach((p, pi) => {
          if (p.x < xmin || p.x > xEnd || p.y < ymin || p.y > ymax) return;
          const px = xToPx(p.x, w);
          const py = yToPx(p.y, h);
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFDF7";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = s.color;
          ctx.stroke();
          if (si === 0 && pi < 4) {
            ctx.fillStyle = INK;
            ctx.font = `600 ${Math.max(10, state.axisFont - 1)}px Inter, system-ui, sans-serif`;
            ctx.fillText(p.label, Math.min(px + 8, w - 90), py - 8);
          }
        });
      });
    }

    // --- hover crosshair ---
    if (hover && state.series[0]?.fn) {
      const { x, y } = hover;
      if (x >= xmin && x <= xEnd && y >= ymin && y <= ymax) {
        const px = xToPx(x, w);
        const py = yToPx(y, h);
        ctx.strokeStyle = "#C85C3A";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#C85C3A";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }

  function frame(now) {
    if (animState !== "playing") return;
    const t = Math.min(1, (now - animT0 + animElapsed) / animDur);
    state.progress = t;
    draw();
    if (t < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      animState = "done";
      animElapsed = 0;
      emitState();
    }
  }

  function emitViewport() {
    if (onViewportCb) onViewportCb({ ...state.viewport });
  }

  function zoomAt(px, py, factor) {
    const w = W();
    const h = H();
    const fx = pxToX(px, w);
    const fy = pxToY(py, h);
    const v = V();
    let nxmin = fx - (fx - v.xmin) / factor;
    let nxmax = fx + (v.xmax - fx) / factor;
    let nymin = fy - (fy - v.ymin) / factor;
    let nymax = fy + (v.ymax - fy) / factor;
    // batas span
    const clamp = (a, b, lo, hi) => {
      const span = b - a;
      if (span < lo) {
        const m = (a + b) / 2;
        return [m - lo / 2, m + lo / 2];
      }
      if (span > hi) {
        const m = (a + b) / 2;
        return [m - hi / 2, m + hi / 2];
      }
      return [a, b];
    };
    [nxmin, nxmax] = clamp(nxmin, nxmax, 1, 200);
    [nymin, nymax] = clamp(nymin, nymax, 1, 200);
    state.viewport = { xmin: nxmin, xmax: nxmax, ymin: nymin, ymax: nymax };
    draw();
    emitViewport();
  }

  function zoomCenter(factor) {
    zoomAt(W() / 2, H() / 2, factor);
  }

  // --- interaksi: wheel zoom, drag pan, hover inspect ---
  function onWheel(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY > 0 ? 1.18 : 1 / 1.18);
  }

  let dragging = null;
  function onPointerDown(e) {
    dragging = { x: e.clientX, y: e.clientY, moved: false };
    canvas.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (dragging) {
      const dx = e.clientX - dragging.x;
      const dy = e.clientY - dragging.y;
      if (Math.abs(e.clientX - dragging.x) + Math.abs(e.clientY - dragging.y) > 3) dragging.moved = true;
      if (dragging.moved) {
        const w = W();
        const h = H();
        const v = V();
        const sx = (v.xmax - v.xmin) / w;
        const sy = (v.ymax - v.ymin) / h;
        state.viewport = {
          xmin: v.xmin - dx * sx,
          xmax: v.xmax - dx * sx,
          ymin: v.ymin + dy * sy,
          ymax: v.ymax + dy * sy,
        };
        dragging.x = e.clientX;
        dragging.y = e.clientY;
        hover = null;
        if (onHoverCb) onHoverCb(null);
        draw();
        emitViewport();
        return;
      }
    }
    // hover inspect (mouse saja, bukan saat drag)
    if (e.pointerType !== "touch" && state.series[0]?.fn) {
      const w = W();
      const h = H();
      const x = pxToX(px, w);
      let y;
      try {
        y = state.series[0].fn(x);
      } catch {
        y = NaN;
      }
      const v = V();
      if (typeof y === "number" && isFinite(y) && y >= v.ymin && y <= v.ymax) {
        const xEnd = v.xmin + (v.xmax - v.xmin) * state.progress;
        if (x <= xEnd) {
          hover = { x: round2(x), y: round2(y), px, py: yToPx(y, h) };
          if (onHoverCb) onHoverCb(hover);
          draw();
          return;
        }
      }
      if (hover !== null) {
        hover = null;
        if (onHoverCb) onHoverCb(null);
        draw();
      }
    }
  }
  function onPointerUp() {
    dragging = null;
  }
  function onPointerLeave() {
    dragging = null;
    if (hover !== null) {
      hover = null;
      if (onHoverCb) onHoverCb(null);
      draw();
    }
  }

  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
  }

  return {
    get animState() {
      return animState;
    },
    setSeries(list) {
      state.series = list.map((s) => {
        try {
          const { fn } = buildFunction(s.expr);
          return { ...s, fn, key: computeKeyPoints(s.expr) };
        } catch {
          return { ...s, fn: null, key: null };
        }
      });
      draw();
    },
    setViewport(v) {
      state.viewport = { ...v };
      draw();
    },
    setOptions(o) {
      Object.assign(state, o);
      draw();
    },
    setAxisFont(px) {
      state.axisFont = px;
      draw();
    },
    play(duration = 1300) {
      cancelAnimationFrame(raf);
      animDur = duration;
      animElapsed = 0;
      state.progress = 0;
      animState = "playing";
      animT0 = performance.now();
      emitState();
      raf = requestAnimationFrame(frame);
    },
    pause() {
      if (animState !== "playing") return;
      animElapsed += performance.now() - animT0;
      animState = "paused";
      cancelAnimationFrame(raf);
      emitState();
    },
    resume() {
      if (animState !== "paused") return;
      animState = "playing";
      animT0 = performance.now();
      emitState();
      raf = requestAnimationFrame(frame);
    },
    replay(duration) {
      this.play(duration ?? animDur);
    },
    stop() {
      cancelAnimationFrame(raf);
      animState = "idle";
      state.progress = 1;
      draw();
      emitState();
    },
    showFull() {
      cancelAnimationFrame(raf);
      animState = "done";
      state.progress = 1;
      draw();
      emitState();
    },
    zoomIn() {
      zoomCenter(1 / 0.75);
    },
    zoomOut() {
      zoomCenter(0.75);
    },
    reset() {
      cancelAnimationFrame(raf);
      animState = state.progress >= 1 ? "done" : animState;
      state.viewport = { ...state.defaults };
      draw();
      emitViewport();
    },
    setDefaults(v) {
      state.defaults = { ...v };
    },
    redraw() {
      draw();
    },
    toDataURL() {
      draw();
      return canvas.toDataURL("image/png");
    },
    onHover(cb) {
      onHoverCb = cb;
    },
    onViewport(cb) {
      onViewportCb = cb;
    },
    onState(cb) {
      onStateCb = cb;
    },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      ro?.disconnect();
    },
  };
}

/** Gambar daerah penyelesaian program linear 2 variabel.
 * constraints: array {a,b,c,op} bermakna a*x + b*y op c, op in '<=','>=','='
 */
export function drawLinearProgram(canvas, constraints, opts = {}) {
  const { xmin = -1, xmax = 12, ymin = -1, ymax = 12 } = opts;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 600;
  const cssH = canvas.clientHeight || 340;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.scale(dpr, dpr);
  const W = cssW, H = cssH;
  const xToPx = (x) => ((x - xmin) / (xmax - xmin)) * W;
  const yToPx = (y) => H - ((y - ymin) / (ymax - ymin)) * H;

  ctx.fillStyle = "#FFFDF7";
  ctx.fillRect(0, 0, W, H);

  // arsir daerah feasible (kotak 2px agar cepat)
  const step = 2;
  const feasibleAt = (x, y) =>
    constraints.every((c) => {
      const lhs = c.a * x + c.b * y;
      if (c.op === "<=") return lhs <= c.c + 1e-9;
      if (c.op === ">=") return lhs >= c.c - 1e-9;
      return Math.abs(lhs - c.c) < 0.15;
    });
  // gambar kotak-kotak dengan fillRect (lebih cepat & tajam)
  ctx.fillStyle = "rgba(217, 164, 65, 0.28)";
  for (let py = 0; py < H; py += step) {
    const yy = ymin + ((H - py) / H) * (ymax - ymin);
    for (let px = 0; px < W; px += step) {
      const xx = xmin + (px / W) * (xmax - xmin);
      if (feasibleAt(xx, yy)) ctx.fillRect(px, py, step, step);
    }
  }

  // grid + sumbu + angka
  const xs = niceStep(xmax - xmin);
  const ys = niceStep(ymax - ymin);
  ctx.font = "10px Inter, system-ui, sans-serif";
  for (let gx = Math.ceil(xmin / xs) * xs; gx <= xmax; gx += xs) {
    const px = xToPx(gx);
    const isAxis = Math.abs(gx) < 1e-9;
    ctx.strokeStyle = isAxis ? "#202522" : "#D8D4C9";
    ctx.lineWidth = isAxis ? 1.6 : 1;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    if (!isAxis) {
      ctx.fillStyle = "#6F756F";
      ctx.fillText(fmtTick(gx, xs), px - 8, H - 6);
    }
  }
  for (let gy = Math.ceil(ymin / ys) * ys; gy <= ymax; gy += ys) {
    const py = yToPx(gy);
    if (py < 8 || py > H - 2) continue;
    const isAxis = Math.abs(gy) < 1e-9;
    ctx.strokeStyle = isAxis ? "#202522" : "#D8D4C9";
    ctx.lineWidth = isAxis ? 1.6 : 1;
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    if (!isAxis) {
      ctx.fillStyle = "#6F756F";
      ctx.fillText(fmtTick(gy, ys), 4, py - 3);
    }
  }

  // garis batas tiap pertidaksamaan
  const colors = ["#C85C3A", "#173F35", "#8a6d1c", "#202522", "#6F756F"];
  constraints.forEach((c, i) => {
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px <= W; px += 2) {
      const x = xmin + (px / W) * (xmax - xmin);
      let y = null;
      if (Math.abs(c.b) > 1e-9) y = (c.c - c.a * x) / c.b;
      else continue; // garis vertikal
      const py = yToPx(y);
      if (py < -50 || py > H + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // garis vertikal x = c/a
    if (Math.abs(c.b) <= 1e-9 && Math.abs(c.a) > 1e-9) {
      const x = c.c / c.a;
      const px = xToPx(x);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    }
  });

  ctx.fillStyle = "#202522";
  ctx.font = "700 12px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("Daerah arsir = daerah penyelesaian", 10, 18);
}
