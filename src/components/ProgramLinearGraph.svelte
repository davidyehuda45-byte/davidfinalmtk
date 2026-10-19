<script>
  import { drawLinearProgram } from "../utils/graph.js";

  let canvas;
  let a1 = $state(1), b1 = $state(1), c1 = $state(10), op1 = $state("<=");
  let a2 = $state(2), b2 = $state(1), c2 = $state(14), op2 = $state("<=");
  let showX = $state(true);
  let showY = $state(true);
  let zx = $state(3), zy = $state(5);
  let hasil = $state("");

  function constraints() {
    const arr = [
      { a: Number(a1), b: Number(b1), c: Number(c1), op: op1 },
      { a: Number(a2), b: Number(b2), c: Number(c2), op: op2 },
    ];
    if (showX) arr.push({ a: 1, b: 0, c: 0, op: ">=" });
    if (showY) arr.push({ a: 0, b: 1, c: 0, op: ">=" });
    return arr;
  }

  function gambar() {
    drawLinearProgram(canvas, constraints(), { xmin: -1, xmax: 12, ymin: -1, ymax: 12 });
  }

  function cariTitikPojok() {
    // kandidat: perpotongan tiap pasangan garis batas + sumbu
    const lines = [
      { a: Number(a1), b: Number(b1), c: Number(c1) },
      { a: Number(a2), b: Number(b2), c: Number(c2) },
      { a: 1, b: 0, c: 0 },
      { a: 0, b: 1, c: 0 },
    ];
    const pts = [];
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const L1 = lines[i], L2 = lines[j];
        const det = L1.a * L2.b - L2.a * L1.b;
        if (Math.abs(det) < 1e-9) continue;
        const x = (L1.c * L2.b - L2.c * L1.b) / det;
        const yy = (L1.a * L2.c - L2.a * L1.c) / det;
        if (!isFinite(x) || !isFinite(yy)) continue;
        const ok = constraints().every((c) => {
          const lhs = c.a * x + c.b * yy;
          if (c.op === "<=") return lhs <= c.c + 1e-6;
          if (c.op === ">=") return lhs >= c.c - 1e-6;
          return true;
        });
        if (ok && x >= -0.01 && yy >= -0.01 && x <= 30 && yy <= 30) {
          pts.push({ x: Math.round(x * 100) / 100, y: Math.round(yy * 100) / 100 });
        }
      }
    }
    // origin selalu kandidat jika feasible
    const cons = constraints();
    const feasible = (x, y) =>
      cons.every((c) => {
        const lhs = c.a * x + c.b * y;
        if (c.op === "<=") return lhs <= c.c + 1e-6;
        if (c.op === ">=") return lhs >= c.c - 1e-6;
        return true;
      });
    if (feasible(0, 0) && !pts.some((p) => p.x === 0 && p.y === 0)) pts.push({ x: 0, y: 0 });

    // deduplikasi
    const uniq = [];
    for (const p of pts) {
      if (!uniq.some((q) => Math.abs(q.x - p.x) < 1e-6 && Math.abs(q.y - p.y) < 1e-6)) uniq.push(p);
    }
    const A = Number(zx), B = Number(zy);
    const scored = uniq.map((p) => ({ ...p, z: A * p.x + B * p.y }));
    scored.sort((p, q) => q.z - p.z);
    if (!scored.length) {
      hasil = "Tidak ditemukan titik pojok. Cek kembali kendalanya.";
      return;
    }
    const maks = scored[0];
    const mins = [...scored].sort((p, q) => p.z - q.z)[0];
    hasil =
      `Titik pojok: ${scored.map((p) => `(${p.x}, ${p.y}) → Z=${Math.round(p.z * 100) / 100}`).join(" ; ")}. ` +
      `Maksimum ${maks.z} di (${maks.x}, ${maks.y}). Minimum ${mins.z} di (${mins.x}, ${mins.y}).`;
  }

  $effect(() => {
    if (canvas) gambar();
  });
</script>

<section class="playground" aria-label="Playground program linear">
  <div class="playground-head">
    <div>
      <span class="tag">Playground</span>
      <h3 class="section-title" style="margin-top:8px">Daerah penyelesaian</h3>
      <p class="section-sub" style="margin-bottom:0">Coba sendiri — ubah kendala, lalu lihat daerah arsirnya. Contoh bawaan: x+y≤10, 2x+y≤14.</p>
    </div>
  </div>

  <div style="display:grid;gap:10px">
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end">
      <label>Kendala 1:<br />
        <span style="display:inline-flex;gap:4px;align-items:center">
          <input class="input" style="width:64px" type="number" bind:value={a1} />x +
          <input class="input" style="width:64px" type="number" bind:value={b1} />y
          <select class="select" style="width:76px" bind:value={op1}>
            <option value="<=">≤</option>
            <option value=">=">≥</option>
          </select>
          <input class="input" style="width:70px" type="number" bind:value={c1} />
        </span>
      </label>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end">
      <label>Kendala 2:<br />
        <span style="display:inline-flex;gap:4px;align-items:center">
          <input class="input" style="width:64px" type="number" bind:value={a2} />x +
          <input class="input" style="width:64px" type="number" bind:value={b2} />y
          <select class="select" style="width:76px" bind:value={op2}>
            <option value="<=">≤</option>
            <option value=">=">≥</option>
          </select>
          <input class="input" style="width:70px" type="number" bind:value={c2} />
        </span>
      </label>
    </div>
    <div style="display:flex;gap:12px;font-size:.9rem">
      <label><input type="checkbox" bind:checked={showX} onchange={gambar} /> x ≥ 0</label>
      <label><input type="checkbox" bind:checked={showY} onchange={gambar} /> y ≥ 0</label>
    </div>
    <div class="graph-row">
      <button class="btn btn-primary" onclick={gambar}>Gambar ulang →</button>
    </div>
  </div>

  <div style="margin-top:10px">
    <canvas bind:this={canvas} class="graph-canvas" style="height:340px"></canvas>
  </div>

  <hr class="worksheet-rule" />
  <p class="kicker"><span class="rule"></span>Nilai optimum</p>
  <h4 style="margin:0 0 6px">Cek titik pojok</h4>
  <div style="display:flex;gap:8px;align-items:end;flex-wrap:wrap">
    <label>Fungsi tujuan Z = <input class="input" style="width:64px;display:inline-block" type="number" bind:value={zx} aria-label="Koefisien x" />x +
      <input class="input" style="width:64px;display:inline-block" type="number" bind:value={zy} aria-label="Koefisien y" />y</label>
    <button class="btn btn-secondary" onclick={cariTitikPojok}>Hitung titik pojok</button>
  </div>
  {#if hasil}
    <div class="alert alert-info">{hasil}</div>
  {/if}
</section>
