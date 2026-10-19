<script>
  import { composeSteps, inverseLinear } from "../utils/calculator.js";

  let f = $state("2x+1");
  let g = $state("x^2");
  let h = $state("x-3");
  let op = $state("f_g");
  let error = $state("");
  let steps = $state([]);
  let result = $state("");
  let invInput = $state("2x+3");
  let invError = $state("");
  let invSteps = $state([]);
  let invResult = $state("");

  const OPS = [
    { id: "f_g", label: "f ∘ g" },
    { id: "g_f", label: "g ∘ f" },
    { id: "f_g_h", label: "f ∘ g ∘ h" },
    { id: "f_h", label: "f ∘ h" },
    { id: "g_h", label: "g ∘ h" },
    { id: "h_g", label: "h ∘ g" },
  ];

  function hitung() {
    error = "";
    steps = [];
    result = "";
    try {
      const out = composeSteps(f, g, h, op);
      steps = out.steps;
      result = out.result;
    } catch (e) {
      error = e.message;
    }
  }

  function hitungInvers() {
    invError = "";
    invSteps = [];
    invResult = "";
    try {
      const out = inverseLinear(invInput);
      invSteps = out.steps;
      invResult = out.result;
    } catch (e) {
      invError = e.message;
    }
  }
</script>

<section class="playground" aria-label="Lembar kerja komposisi">
  <div class="playground-head">
    <div>
      <span class="tag">Lembar kerja</span>
      <h3 class="section-title" style="margin-top:8px">Komposisi</h3>
      <p class="section-sub" style="margin-bottom:0">Masukkan fungsi, pilih operasi, tekan hitung — lalu lihat cara kerjanya.</p>
    </div>
  </div>

  <div class="calc-grid">
    <div>
      <label class="label" for="calc-f">f(x) =</label>
      <input id="calc-f" class="input input-mono" bind:value={f} placeholder="2x+1" spellcheck="false" />
    </div>
    <div>
      <label class="label" for="calc-g">g(x) =</label>
      <input id="calc-g" class="input input-mono" bind:value={g} placeholder="x^2" spellcheck="false" />
    </div>
    <div>
      <label class="label" for="calc-h">h(x) =</label>
      <input id="calc-h" class="input input-mono" bind:value={h} placeholder="x-3" spellcheck="false" />
    </div>
  </div>

  <p class="label" id="op-label" style="margin-bottom:0">Operasi:</p>
  <div class="op-grid" role="group" aria-labelledby="op-label">
    {#each OPS as o}
      <button class="op-btn" class:active={op === o.id} onclick={() => (op = o.id)} aria-pressed={op === o.id}>{o.label}</button>
    {/each}
  </div>

  <button class="btn btn-primary btn-block" onclick={hitung}>Hitung →</button>

  {#if error}
    <div class="alert alert-error">{error}</div>
  {/if}
  {#if steps.length}
    <hr class="worksheet-rule" />
    <p class="kicker"><span class="rule"></span>Cara kerja</p>
    {#each steps as s}
      <div class="formula light">{s}</div>
    {/each}
    <div class="result-box"><span class="lbl">Hasil</span>{result}</div>
  {/if}

  <hr class="worksheet-rule" />

  <p class="kicker"><span class="rule"></span>Invers (khusus linear)</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <label class="label" for="inv-input" style="margin:0;align-self:center">f(x) =</label>
    <input id="inv-input" class="input input-mono" style="flex:1;min-width:180px" bind:value={invInput} placeholder="2x+3" />
    <button class="btn btn-secondary" onclick={hitungInvers}>Cari invers</button>
  </div>
  {#if invError}
    <div class="alert alert-error">{invError}</div>
  {/if}
  {#if invSteps.length}
    <div style="margin-top:10px">
      {#each invSteps as s}
        <div class="formula light">{s}</div>
      {/each}
      <div class="result-box"><span class="lbl">Hasil</span>{invResult}</div>
    </div>
  {/if}
  <p class="hint">Ingat: (f ∘ g)(x) berarti f(g(x)) — kerjakan g dulu. Coba f(x)=2x+1, g(x)=x², lalu bandingkan f∘g dengan g∘f.</p>
</section>
