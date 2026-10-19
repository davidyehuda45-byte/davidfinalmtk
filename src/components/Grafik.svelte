<script>
  import { validateExpression, pretty, cleanExpression, classifyFunction } from "../utils/calculator.js";
  import { createFunctionPlot } from "../utils/graph.js";

  let {
    placeholder = "2x+3",
    contoh = ["2x+3", "-x+5", "0.5x-2", "x^2-4x+3"],
    contohG = ["x^2", "-x^2+4", "2x+1"],
    warna = "#173F35",
    judul = "Playground grafik",
    sub = "Coba ubah fungsi ini, lalu lihat gambarnya.",
  } = $props();

  const SPEEDS = [
    { id: "lambat", label: "Lambat", dur: 2200 },
    { id: "normal", label: "Normal", dur: 1300 },
    { id: "cepat", label: "Cepat", dur: 700 },
  ];
  const SECOND = "#C85C3A";
  const DEFAULT_VP = { xmin: -10, xmax: 10, ymin: -10, ymax: 10 };

  let input = $state(contoh[0] ?? placeholder);
  let ginput = $state(contohG[0] ?? "x^2");
  let banding = $state(false);
  let speed = $state("normal");
  let error = $state("");
  let gerror = $state("");
  let analisis = $state(null);
  let drawn = $state("");

  let canvas;
  let wrapEl;
  let engine = null;
  let anim = $state("done");
  let tip = $state(null);
  let fs = $state(false);
  let present = $state(false);

  let xmin = $state(DEFAULT_VP.xmin);
  let xmax = $state(DEFAULT_VP.xmax);
  let ymin = $state(DEFAULT_VP.ymin);
  let ymax = $state(DEFAULT_VP.ymax);

  let showGrid = $state(true);
  let showNumbers = $state(true);
  let showAxes = $state(true);
  let showPoints = $state(true);

  function dur() {
    return SPEEDS.find((s) => s.id === speed)?.dur ?? 1300;
  }

  function terapkanSeri() {
    error = "";
    gerror = "";
    analisis = null;
    const v = validateExpression(input);
    if (!v.ok) {
      error = v.message;
      return false;
    }
    const list = [{ expr: input, color: warna }];
    if (banding) {
      const vg = validateExpression(ginput);
      if (!vg.ok) {
        gerror = vg.message;
        return false;
      }
      list.push({ expr: ginput, color: SECOND, dash: [7, 5] });
    }
    engine.setSeries(list);
    drawn = cleanExpression(input);
    try {
      analisis = classifyFunction(input);
    } catch {
      analisis = null;
    }
    return true;
  }

  function gambarkan() {
    if (!engine) return;
    if (!terapkanSeri()) return;
    tip = null;
    engine.play(dur());
  }

  function jedaLanjut() {
    if (!engine) return;
    if (anim === "playing") engine.pause();
    else if (anim === "paused") engine.resume();
  }

  function ulangi() {
    if (!engine) return;
    if (!terapkanSeri()) return;
    tip = null;
    engine.replay(dur());
  }

  function contohCepat(c) {
    input = c;
    gambarkan();
  }

  function terapkanRentang() {
    if (!engine) return;
    const v = {
      xmin: Number(xmin),
      xmax: Number(xmax),
      ymin: Number(ymin),
      ymax: Number(ymax),
    };
    if (![v.xmin, v.xmax, v.ymin, v.ymax].every((n) => isFinite(n))) {
      error = "Rentang harus berupa angka. Contoh: X min −10, X max 10.";
      return;
    }
    if (v.xmin >= v.xmax || v.ymin >= v.ymax) {
      error = "Nilai min harus lebih kecil dari max (X min < X max, Y min < Y max).";
      return;
    }
    error = "";
    engine.setViewport(v);
  }

  function preset(span) {
    xmin = -span;
    xmax = span;
    ymin = -span;
    ymax = span;
    terapkanRentang();
  }

  function toggleFullscreen() {
    if (!wrapEl) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapEl.requestFullscreen?.();
  }

  function exportPNG() {
    if (!engine) return;
    const slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "grafik";
    const a = document.createElement("a");
    a.href = engine.toDataURL();
    a.download = `mathlearn-${slug}.png`;
    a.click();
  }

  function feedback() {
    if (!analisis) return "";
    if (analisis.type === "linear") {
      const m = analisis.a;
      const arah = m > 0 ? "naik" : m < 0 ? "turun" : "datar";
      const curam = Math.abs(m) > 1 ? "cukup curam" : Math.abs(m) < 1 && m !== 0 ? "landai" : "pas 45°";
      return `Garis ${arah} dan ${curam} karena gradien m = ${m}. Coba ganti angkanya (misal 0.5x+1 atau -2x+4), tekan Gambarkan, dan bandingkan kemiringannya.`;
    }
    if (analisis.type === "quadratic") {
      const arah = analisis.a > 0 ? "terbuka ke atas (punya nilai minimum)" : "terbuka ke bawah (punya nilai maksimum)";
      return `Parabola ${arah} dengan puncak (${analisis.vertex.x}, ${analisis.vertex.y}). Nilai a menentukan arah buka — coba ubah tandanya dan lihat apa yang terjadi.`;
    }
    return "Bentuknya bukan garis lurus maupun parabola. Perhatikan titik potong dan perilakunya, lalu coba fungsi lain untuk membandingkan.";
  }

  $effect(() => {
    if (!canvas || engine) return;
    engine = createFunctionPlot(canvas);
    engine.onState((s) => (anim = s));
    engine.onHover((h) => (tip = h));
    engine.onViewport((v) => {
      xmin = Math.round(v.xmin * 100) / 100;
      xmax = Math.round(v.xmax * 100) / 100;
      ymin = Math.round(v.ymin * 100) / 100;
      ymax = Math.round(v.ymax * 100) / 100;
    });
    engine.setOptions({
      showGrid,
      showNumbers,
      showAxes,
      showPoints,
    });
    terapkanSeri();
    engine.showFull();
    const onFs = () => (fs = !!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      engine?.destroy();
      engine = null;
    };
  });

  $effect(() => {
    engine?.setOptions({ showGrid, showNumbers, showAxes, showPoints });
  });

  $effect(() => {
    engine?.setAxisFont(present ? 14 : 11);
  });
</script>

<section class="playground" class:present aria-label={judul} bind:this={wrapEl}>
  <div class="playground-head">
    <div>
      <span class="tag">Playground</span>
      <h3 class="section-title" style="margin-top:8px">{judul}</h3>
      <p class="section-sub" style="margin-bottom:0">Coba sendiri — {sub}</p>
    </div>
  </div>

  <label class="label" for="fx-input">f(x) =</label>
  <input
    id="fx-input"
    class="input input-mono"
    bind:value={input}
    placeholder={placeholder}
    spellcheck="false"
    autocomplete="off"
  />

  <p class="kicker" style="margin:12px 0 6px"><span class="rule"></span>Contoh cepat</p>
  <div class="chips" aria-label="Contoh fungsi cepat">
    {#each contoh as c}
      <button class="chip" onclick={() => contohCepat(c)}>[ {c} ]</button>
    {/each}
  </div>

  <label style="display:flex;gap:8px;align-items:center;font-size:.9rem;margin-top:10px">
    <input type="checkbox" bind:checked={banding} onchange={() => { if (anim !== "playing") terapkanSeri(); }} />
    Bandingkan dua fungsi (+ g(x))
  </label>
  {#if banding}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
      <label class="label" for="gx-input" style="margin:0;align-self:center">g(x) =</label>
      <input id="gx-input" class="input input-mono" style="flex:1;min-width:160px" bind:value={ginput} placeholder="x^2" spellcheck="false" />
    </div>
    <div class="chips">
      {#each contohG as c}
        <button class="chip" onclick={() => { ginput = c; if (anim !== "playing") terapkanSeri(); }}>[ {c} ]</button>
      {/each}
    </div>
    {#if gerror}
      <div class="alert alert-error">{gerror}</div>
    {/if}
  {/if}

  <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-top:10px">
    <label style="font-size:.88rem">Kecepatan:
      <select class="select" style="width:auto;display:inline-block" bind:value={speed} aria-label="Kecepatan animasi">
        {#each SPEEDS as s}
          <option value={s.id}>{s.label}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="graph-row" style="margin-top:10px">
    <button class="btn btn-primary" onclick={gambarkan} disabled={anim === "playing"}>
      {anim === "playing" ? "Menggambar…" : "Gambarkan →"}
    </button>
    {#if anim === "playing"}
      <button class="btn btn-secondary" onclick={jedaLanjut}>Jeda ⏸</button>
    {:else if anim === "paused"}
      <button class="btn btn-secondary" onclick={jedaLanjut}>Lanjutkan ▶</button>
    {/if}
    <button class="btn btn-secondary" onclick={ulangi} disabled={anim === "playing"}>Ulangi ↻</button>
  </div>

  {#if error}
    <div class="alert alert-error">
      <b>Format fungsi belum dikenali.</b><br />{error}<br />
      <span class="hint">Coba gunakan format: 2x+3, -x+5, 0.5x-2, x^2-4x+3.</span>
    </div>
  {/if}

  <div class="graph-wrap">
    <canvas bind:this={canvas} class="graph-canvas" aria-label="Grafik fungsi interaktif"></canvas>
    <div class="graph-tools" role="toolbar" aria-label="Kontrol tampilan grafik">
      <button onclick={() => engine?.zoomIn()} aria-label="Zoom in" title="Zoom in">+</button>
      <button onclick={() => engine?.zoomOut()} aria-label="Zoom out" title="Zoom out">−</button>
      <button onclick={() => engine?.reset()} aria-label="Reset tampilan" title="Reset (⌂)">⌂</button>
      <button onclick={toggleFullscreen} aria-label="Fullscreen" title="Fullscreen">⛶</button>
    </div>
    {#if tip}
      <div
        class="graph-tip"
        style="left:{Math.min(tip.px + 14, 220)}px;top:{Math.max(tip.py - 54, 4)}px"
      >
        x = {tip.x}<br />y = {tip.y}
      </div>
    {/if}
  </div>
  <p class="hint">Geser (drag) untuk pan • Scroll mouse untuk zoom • Arahkan mouse untuk melihat koordinat titik.</p>

  {#if banding && !error && !gerror}
    <div class="legend" aria-label="Legend fungsi">
      <span><i style="background:{warna}"></i>f(x) = {pretty(drawn)}</span>
      <span><i class="dash" style="background:{SECOND}"></i>g(x) = {pretty(cleanExpression(ginput))}</span>
    </div>
  {:else if drawn && !error}
    <p class="graph-meta">Hasil grafik: <b>y = {pretty(drawn)}</b> — ubah rumus di atas, grafik ikut berubah.</p>
  {/if}

  <p class="graph-meta" style="font-family:var(--mono)">X: {xmin} → {xmax} &nbsp;•&nbsp; Y: {ymin} → {ymax}</p>

  <div class="range-grid">
    <label>X min<input class="input input-mono" type="number" step="any" bind:value={xmin} /></label>
    <label>X max<input class="input input-mono" type="number" step="any" bind:value={xmax} /></label>
    <label>Y min<input class="input input-mono" type="number" step="any" bind:value={ymin} /></label>
    <label>Y max<input class="input input-mono" type="number" step="any" bind:value={ymax} /></label>
  </div>
  <div class="graph-row" style="margin-top:8px">
    <button class="btn btn-secondary btn-small" onclick={terapkanRentang}>Terapkan rentang</button>
    <button class="btn btn-ghost btn-small" onclick={() => preset(5)}>−5 → 5</button>
    <button class="btn btn-ghost btn-small" onclick={() => preset(10)}>−10 → 10</button>
    <button class="btn btn-ghost btn-small" onclick={() => preset(20)}>−20 → 20</button>
  </div>

  <div class=" playground-panels">
    <div>
      <p class="kicker"><span class="rule"></span>Analisis</p>
      {#if analisis && !error}
        {#if analisis.type === "linear"}
          <ul class="fact-list">
            <li><b>Jenis:</b> fungsi linear</li>
            <li><b>Gradien:</b> m = {analisis.a}</li>
            <li><b>Potong Y:</b> (0, {analisis.yInt})</li>
            {#if analisis.xRoot !== undefined}
              <li><b>Potong X:</b> ({analisis.xRoot}, 0)</li>
            {/if}
          </ul>
        {:else if analisis.type === "quadratic"}
          <ul class="fact-list">
            <li><b>Jenis:</b> fungsi kuadrat</li>
            <li><b>Puncak:</b> ({analisis.vertex.x}, {analisis.vertex.y})</li>
            <li><b>Sumbu simetri:</b> x = {analisis.axis}</li>
            <li><b>Potong Y:</b> (0, {analisis.yInt})</li>
            {#if analisis.roots.length}
              <li><b>Akar:</b> x = {analisis.roots.join(" dan ")}</li>
            {:else}
              <li><b>Akar:</b> tidak ada akar real (D = {analisis.D})</li>
            {/if}
          </ul>
        {:else}
          <ul class="fact-list">
            <li><b>Jenis:</b> fungsi lain</li>
            {#if analisis.yInt !== null}
              <li><b>Potong Y:</b> (0, {analisis.yInt})</li>
            {/if}
            {#if analisis.roots.length}
              <li><b>Perkiraan akar:</b> {analisis.roots.join(", ")}</li>
            {/if}
          </ul>
        {/if}
        {#if anim === "done"}
          <div class="alert alert-success">Grafik berhasil dibuat. {feedback()}</div>
        {/if}
      {:else if !error}
        <p class="hint">Tekan <b>Gambarkan</b> untuk melihat analisis fungsi.</p>
      {/if}
    </div>
    <div>
      <p class="kicker"><span class="rule"></span>Tampilan</p>
      <div class="toggle-list">
        <label><input type="checkbox" bind:checked={showGrid} /> Grid</label>
        <label><input type="checkbox" bind:checked={showNumbers} /> Angka</label>
        <label><input type="checkbox" bind:checked={showAxes} /> Sumbu</label>
        <label><input type="checkbox" bind:checked={showPoints} /> Titik penting</label>
      </div>
      <div class="graph-row" style="margin-top:10px">
        <button class="btn btn-secondary btn-small" onclick={() => (present = !present)} aria-pressed={present}>
          {present ? "Keluar mode presentasi" : "Mode presentasi"}
        </button>
        <button class="btn btn-secondary btn-small" onclick={exportPNG}>Simpan PNG ↓</button>
      </div>
    </div>
  </div>
</section>

<style>
  .graph-wrap { position: relative; margin-top: 12px; }
  .graph-tools {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .graph-tools button {
    width: 36px;
    height: 36px;
    font-size: 1.05rem;
    font-weight: 700;
    background: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: var(--radius-md);
    cursor: pointer;
    box-shadow: var(--shadow-small);
    color: var(--ink);
  }
  .graph-tools button:hover { background: var(--accent-soft); }
  .graph-tip {
    position: absolute;
    background: var(--ink);
    color: #FFFDF7;
    font-family: var(--mono);
    font-size: 0.8rem;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    pointer-events: none;
    white-space: nowrap;
  }
  .legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-family: var(--mono);
    font-size: 0.88rem;
    margin-top: 10px;
  }
  .legend i {
    display: inline-block;
    width: 22px;
    height: 4px;
    margin-right: 6px;
    vertical-align: middle;
  }
  .legend i.dash { height: 0; border-top: 4px dashed var(--ink); border-color: inherit; }
  .range-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 10px;
  }
  .range-grid label { font-size: 0.82rem; font-weight: 600; display: grid; gap: 4px; }
  .playground-panels {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 14px;
    border-top: 2px solid var(--ink);
    padding-top: 12px;
  }
  .fact-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: 0.93rem; }
  .fact-list li { border-bottom: 1px dashed var(--border); padding-bottom: 6px; }
  .toggle-list { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9rem; }
  @media (min-width: 768px) {
    .playground-panels { grid-template-columns: 1.2fr 1fr; }
    .range-grid { grid-template-columns: repeat(4, 1fr); }
  }
  .present canvas.graph-canvas { height: 480px; }
  .present .input { font-size: 1.12rem; }
  :fullscreen.playground { overflow-y: auto; border-radius: 0; }
</style>
