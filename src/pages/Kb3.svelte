<script>
  import { MATERI } from "../data/materi.js";
  import { CONTOH_SOAL } from "../data/soal.js";
  import { KUIS } from "../data/kuis.js";
  import Grafik from "../components/Grafik.svelte";
  import Kalkulator from "../components/Kalkulator.svelte";
  import ContohSoal from "../components/ContohSoal.svelte";
  import Kuis from "../components/Kuis.svelte";
  import KbTools from "../components/KbTools.svelte";

  let { onNav = () => {}, onProgress = () => {} } = $props();

  $effect(() => {
    onProgress("kb3");
  });
  function quizDone() {
    onProgress("kb3");
  }
</script>

<div class="container page">
  <div class="kb-nav">
    <button class="btn btn-secondary btn-small" onclick={() => onNav("dashboard")}>← Daftar bab</button>
    <span class="badge">Bab 03</span>
  </div>

  <header class="kb-header" style="margin-top:12px">
    <p class="kicker"><span class="rule"></span>Bab 03</p>
    <h2>Komposisi &amp; Invers</h2>
    <p>Fungsi di dalam fungsi. Lihat cara kerjanya langkah demi langkah di lembar kerja.</p>
  </header>

  <div class="card materi-body">
    <div class="toc" aria-label="Daftar isi bab">
      {#each MATERI.kb3 as m, i}
        <a href="#kb3-{i}">{String(i + 1).padStart(2, "0")} — {m.judul.replace(/^\d+\.\s*/, "")}</a>
      {/each}
    </div>
    {#each MATERI.kb3 as m, i}
      <section class="materi-section" id="kb3-{i}">
        <p class="materi-no">{String(i + 1).padStart(2, "0")}</p>
        <h4>{m.judul.replace(/^\d+\.\s*/, "")}</h4>
        {#each m.isi ?? [] as p}
          <p>{p}</p>
        {/each}
        {#each m.rumus ?? [] as r}
          <div class="formula">{r}</div>
        {/each}
        {#if m.list}
          <ul>
            {#each m.list as li}
              <li>{li}</li>
            {/each}
          </ul>
        {/if}
      </section>
    {/each}
  </div>

  <Kalkulator />

  <Grafik judul="Playground: cek tiap fungsi" sub="gambar f, g, atau inversnya satu per satu." placeholder="2x+1" contoh={["2x+1", "x^2", "(x-3)/2"]} warna="#173F35" />

  <ContohSoal items={CONTOH_SOAL.kb3} judul="Latihan 03 — Komposisi & invers" />

  <Kuis kbId="kb3" items={KUIS.kb3} judul="Kuis 03 — Komposisi & invers" onFinish={quizDone} />

  <KbTools kbId="kb3" />

  <div class="kb-nav">
    <button class="btn btn-secondary" onclick={() => onNav("kb2")}>← Bab 02</button>
    <button class="btn btn-primary" onclick={() => onNav("kb4")}>Bab 04 →</button>
  </div>
</div>
