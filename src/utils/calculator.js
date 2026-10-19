// Parser & kalkulator fungsi untuk materi SMK.
// Mendukung: 2x+3, x^2-4x+3, x², pecahan sederhana, sin/cos/sqrt/abs.

const SUPERSCRIPT_MAP = { "²": "^2", "³": "^3", "⁴": "^4" };

export function cleanExpression(raw) {
  if (typeof raw !== "string") return "";
  let s = raw.toLowerCase().trim();
  // ganti unicode superscript
  for (const [k, v] of Object.entries(SUPERSCRIPT_MAP)) s = s.split(k).join(v);
  // hapus prefix f(x)=, g(x)=, h(x)=, y=
  s = s.replace(/^[fghy]\s*\(\s*x\s*\)\s*=/, "");
  s = s.replace(/^y\s*=/, "");
  s = s.replace(/^f\s*=/, "");
  s = s.replace(/\s+/g, "");
  if (s === "") return "";
  // koma desimal Indonesia -> titik
  // (hanya jika tidak ada titik dan ada koma di antara angka)
  // biarkan sederhana: jangan ubah koma pemisah fungsi
  return s;
}

function insertImplicitMult(s) {
  let r = s;
  // 2x -> 2*x, 2(x -> 2*(x, )x, )(
  r = r.replace(/(\d)(x)/g, "$1*$2");
  r = r.replace(/(\d)(\()/g, "$1*$2");
  r = r.replace(/(x)(\d)/g, "$1*$2");
  r = r.replace(/(x)(\()/g, "$1*$2");
  r = r.replace(/(\))(\()/g, "$1*$2");
  r = r.replace(/(\))x/g, "$1*x");
  r = r.replace(/(x)([a-z])/g, "$1*$2");
  return r;
}

function jsify(s) {
  let r = insertImplicitMult(s);
  // ^ -> **
  r = r.replace(/\^/g, "**");
  // fungsi matematika -> Math.*
  r = r
    .replace(/(?<![a-z])sqrt(?=\()/g, "Math.sqrt")
    .replace(/(?<![a-z])sin(?=\()/g, "Math.sin")
    .replace(/(?<![a-z])cos(?=\()/g, "Math.cos")
    .replace(/(?<![a-z])tan(?=\()/g, "Math.tan")
    .replace(/(?<![a-z])abs(?=\()/g, "Math.abs")
    .replace(/(?<![a-z])ln(?=\()/g, "Math.log")
    .replace(/(?<![a-z])log(?=\()/g, "Math.log10");
  // konstanta pi (hati-hati dengan Math.PI yang sudah ada)
  r = r.replace(/math\.pi/g, "__PI__");
  r = r.replace(/(?<![a-z])pi(?![a-z])/g, "Math.PI");
  r = r.replace(/__PI__/g, "math.pi");
  return r;
}

export function validateExpression(raw) {
  const s = cleanExpression(raw);
  if (!s) return { ok: false, message: "Silakan masukkan fungsi terlebih dahulu." };
  // karakter yang diizinkan: angka, x, operator, kurung, titik, huruf untuk fungsi
  const withoutFuncs = s
    .replace(/sqrt|sin|cos|tan|abs|ln|log|pi/gi, "");
  if (!/^[0-9x+\-*/().^ ]*$/.test(withoutFuncs)) {
    return {
      ok: false,
      message: "Format fungsi belum dikenali. Contoh: 2x+3 atau x^2-4x+3.",
    };
  }
  // kurung seimbang?
  let depth = 0;
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth < 0) return { ok: false, message: "Kurung tidak seimbang. Periksa kembali fungsi." };
  }
  if (depth !== 0) return { ok: false, message: "Kurung tidak seimbang. Periksa kembali fungsi." };
  // coba evaluasi
  try {
    const { fn } = buildFunction(raw);
    const t = [0, 1, -1, 2].map((x) => {
      try { return fn(x); } catch { return NaN; }
    });
    if (t.every((v) => typeof v !== "number" || !isFinite(v))) {
      return { ok: false, message: "Fungsi tidak menghasilkan nilai. Coba contoh: 2x+3." };
    }
  } catch {
    return { ok: false, message: "Format fungsi belum dikenali. Contoh: 2x+3 atau x^2-4x+3." };
  }
  return { ok: true, cleaned: s };
}

export function buildFunction(raw) {
  const s = cleanExpression(raw);
  if (!s) throw new Error("Fungsi kosong.");
  // Pemeriksaan keamanan: hanya karakter matematika yang diizinkan.
  const withoutFuncs = s.replace(/sqrt|sin|cos|tan|abs|ln|log|pi/gi, "");
  if (!/^[0-9x+\-*/().^ ]*$/.test(withoutFuncs)) {
    throw new Error("Format fungsi belum dikenali. Contoh: 2x+3 atau x^2-4x+3.");
  }
  const js = jsify(s);
  const fn = new Function("x", `"use strict"; return (${js});`);
  // uji sintaks
  fn(0);
  return { fn, jsExpr: js, cleaned: s };
}

export function evalAt(raw, x) {
  const { fn } = buildFunction(raw);
  return fn(x);
}

/** Klasifikasi fungsi untuk panel analisis grafik.
 * Mengembalikan { type: 'linear'|'quadratic'|'other', ... }.
 */
export function classifyFunction(raw) {
  const { fn } = buildFunction(raw);
  const r2 = (n) => Math.round(n * 100) / 100;
  const yInt = fn(0);
  // linear?
  const b = yInt;
  const a = fn(1) - b;
  const isLinear =
    isFinite(a) &&
    isFinite(b) &&
    [2, -2, 3, 0.5].every((x) => {
      try {
        return Math.abs(fn(x) - (a * x + b)) < 1e-6;
      } catch {
        return false;
      }
    });
  if (isLinear) {
    const out = { type: "linear", a: r2(a), b: r2(b), yInt: r2(b) };
    if (Math.abs(a) > 1e-9) out.xRoot = r2(-b / a);
    return out;
  }
  // kuadrat? selisih kedua konstan → f(x) = ax²+bx+c
  try {
    const d = (x) => fn(x + 1) - 2 * fn(x) + fn(x - 1);
    const d0 = d(0);
    const stable = [-2, -1, 1, 2].every((x) => Math.abs(d(x) - d0) < 1e-6);
    if (stable && Math.abs(d0) > 1e-9) {
      const qa = d0 / 2;
      const qc = fn(0);
      const qb = fn(1) - qa - qc;
      const ok = [2, -1, -2].every((x) => Math.abs(fn(x) - (qa * x * x + qb * x + qc)) < 1e-5);
      if (ok) {
        const D = qb * qb - 4 * qa * qc;
        const xv = -qb / (2 * qa);
        const yv = fn(xv);
        const roots = [];
        if (D > 1e-9) {
          roots.push(r2((-qb - Math.sqrt(D)) / (2 * qa)));
          roots.push(r2((-qb + Math.sqrt(D)) / (2 * qa)));
        } else if (Math.abs(D) <= 1e-9) {
          roots.push(r2(xv));
        }
        return {
          type: "quadratic",
          a: r2(qa), b: r2(qb), c: r2(qc),
          vertex: { x: r2(xv), y: r2(yv) },
          axis: r2(xv),
          roots,
          D: r2(D),
          yInt: r2(qc),
        };
      }
    }
  } catch { /* bukan kuadrat */ }
  // umum: cari akar via perubahan tanda
  const roots = [];
  try {
    for (let x = -10; x < 10; x += 0.25) {
      const y1 = fn(x);
      const y2 = fn(x + 0.25);
      if (!isFinite(y1) || !isFinite(y2)) continue;
      if (y1 === 0) roots.push(r2(x));
      else if (y1 * y2 < 0) roots.push(r2(x + 0.125));
      if (roots.length >= 4) break;
    }
  } catch { /* abaikan */ }
  return { type: "other", yInt: isFinite(yInt) ? r2(yInt) : null, roots };
}

/** Komposisi simbolik: ganti x pada outer dengan (inner). */
export function composeRaw(outerRaw, innerRaw) {
  const outer = cleanExpression(outerRaw);
  const inner = cleanExpression(innerRaw);
  if (!outer || !inner) throw new Error("Fungsi kosong.");
  const wrapped = `(${inner})`;
  // ganti variabel x yang berdiri sendiri (bukan bagian nama fungsi)
  const composed = outer.replace(/(?<![a-z])x(?![a-z])/g, wrapped);
  return basicTidy(composed);
}

function basicTidy(s) {
  let r = s;
  r = r.replace(/\(\(([^()]+)\)\)/g, "($1)");
  r = r.replace(/--/g, "+");
  r = r.replace(/\+\-/g, "-");
  return r;
}

/** Pretty: x^2 -> x², * -> hilang jika sebelum x/kurung untuk tampilan. */
export function pretty(expr) {
  if (!expr) return "";
  let r = expr;
  r = r.replace(/\*\*/g, "^");
  r = r.replace(/\^2/g, "²").replace(/\^3/g, "³");
  return r;
}

export function composeSteps(fRaw, gRaw, hRaw, op) {
  const f = cleanExpression(fRaw);
  const g = cleanExpression(gRaw);
  const h = hRaw ? cleanExpression(hRaw) : "";
  if (!f) throw new Error("Isi f(x) terlebih dahulu, contoh: 2x+1.");
  if (!g) throw new Error("Isi g(x) terlebih dahulu, contoh: x^2.");
  const needH = op.includes("h");
  if (needH && !h) throw new Error("Operasi ini membutuhkan h(x). Silakan isi h(x).");

  // validasi masing-masing
  for (const [label, raw] of [["f(x)", fRaw], ["g(x)", gRaw]]) {
    const v = validateExpression(raw);
    if (!v.ok) throw new Error(`${label}: ${v.message}`);
  }
  if (needH) {
    const v = validateExpression(hRaw);
    if (!v.ok) throw new Error(`h(x): ${v.message}`);
  }

  let steps = [];
  let result = "";
  const pf = pretty(f), pg = pretty(g), ph = pretty(h);

  const sub1 = (o, i) => composeRaw(o, i);

  if (op === "f_g") {
    const fg = sub1(f, g);
    steps = [
      `Diketahui f(x) = ${pf}, g(x) = ${pg}.`,
      `(f ∘ g)(x) = f(g(x))`,
      `= f(${pg})`,
      `= ${pretty(fg)}`,
    ];
    result = `(f ∘ g)(x) = ${pretty(fg)}`;
  } else if (op === "g_f") {
    const gf = sub1(g, f);
    steps = [
      `Diketahui f(x) = ${pf}, g(x) = ${pg}.`,
      `(g ∘ f)(x) = g(f(x))`,
      `= g(${pf})`,
      `= ${pretty(gf)}`,
    ];
    result = `(g ∘ f)(x) = ${pretty(gf)}`;
  } else if (op === "f_h") {
    const fh = sub1(f, h);
    steps = [
      `Diketahui f(x) = ${pf}, h(x) = ${ph}.`,
      `(f ∘ h)(x) = f(h(x))`,
      `= f(${ph})`,
      `= ${pretty(fh)}`,
    ];
    result = `(f ∘ h)(x) = ${pretty(fh)}`;
  } else if (op === "g_h") {
    const gh = sub1(g, h);
    steps = [
      `Diketahui g(x) = ${pg}, h(x) = ${ph}.`,
      `(g ∘ h)(x) = g(h(x))`,
      `= g(${ph})`,
      `= ${pretty(gh)}`,
    ];
    result = `(g ∘ h)(x) = ${pretty(gh)}`;
  } else if (op === "h_g") {
    const hg = sub1(h, g);
    steps = [
      `Diketahui h(x) = ${ph}, g(x) = ${pg}.`,
      `(h ∘ g)(x) = h(g(x))`,
      `= h(${pg})`,
      `= ${pretty(hg)}`,
    ];
    result = `(h ∘ g)(x) = ${pretty(hg)}`;
  } else if (op === "f_g_h") {
    const gh = sub1(g, h);
    const fgh = sub1(f, gh);
    steps = [
      `Diketahui f(x) = ${pf}, g(x) = ${pg}, h(x) = ${ph}.`,
      `(f ∘ g ∘ h)(x) = f(g(h(x)))`,
      `Langkah 1: g(h(x)) = g(${ph}) = ${pretty(gh)}`,
      `Langkah 2: f(g(h(x))) = f(${pretty(gh)})`,
      `= ${pretty(fgh)}`,
    ];
    result = `(f ∘ g ∘ h)(x) = ${pretty(fgh)}`;
  } else {
    throw new Error("Operasi tidak dikenal.");
  }

  // verifikasi numerik: pastikan hasil bisa dievaluasi di beberapa titik
  try {
    const { fn } = buildFunction(result.split("=").pop());
    [0, 1, 2].forEach((x) => fn(x));
  } catch {
    // jika gagal, tetap tampilkan hasil simbolik (string substitution selalu valid)
  }

  return { steps, result, composedRaw: result.split("=").pop().trim() };
}

/** Invers fungsi linear: f(x)=ax+b -> (x-b)/a. */
export function inverseLinear(raw) {
  const v = validateExpression(raw);
  if (!v.ok) throw new Error(v.message);
  const { fn } = buildFunction(raw);
  const b = fn(0);
  const a = fn(1) - b;
  if (Math.abs(a) < 1e-9) throw new Error("Fungsi konstan tidak memiliki invers.");
  // cek linearitas
  const check = [2, -1, 3].every((x) => Math.abs(fn(x) - (a * x + b)) < 1e-6);
  if (!check) {
    throw new Error(
      "Kalkulator invers sederhana ini hanya mendukung fungsi linear (contoh: 2x+3). Untuk kuadrat/pecahan, pelajari langkah di materi."
    );
  }
  const fmt = (n) => {
    const r = Math.round(n * 1000) / 1000;
    return Number.isInteger(r) ? String(r) : String(r);
  };
  let inv;
  if (b === 0) inv = `x/${fmt(a)}`;
  else if (b > 0) inv = `(x-${fmt(b)})/${fmt(a)}`;
  else inv = `(x+${fmt(Math.abs(b))})/${fmt(a)}`;
  if (a === 1 && b === 0) inv = "x";
  return {
    a, b,
    steps: [
      `Misal y = ${pretty(cleanExpression(raw))}. Tukar x dan y, lalu selesaikan untuk y.`,
      `y = ${fmt(a)}x + (${fmt(b)})  →  x = ${fmt(a)}y + (${fmt(b)})`,
      `x - (${fmt(b)}) = ${fmt(a)}y`,
      `y = ${pretty(inv)}`,
    ],
    result: `f⁻¹(x) = ${pretty(inv)}`,
  };
}
