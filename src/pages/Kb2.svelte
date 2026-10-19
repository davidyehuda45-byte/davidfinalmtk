<script>
  import { MATERI } from "../data/materi.js";
  import { CONTOH_SOAL } from "../data/soal.js";
  import { KUIS } from "../data/kuis.js";
  import Grafik from "../components/Grafik.svelte";
  import ContohSoal from "../components/ContohSoal.svelte";
  import Kuis from "../components/Kuis.svelte";
  import KbTools from "../components/KbTools.svelte";

  let { onNav = () => {}, onProgress = () => {} } = $props();

  $effect(() => {
    onProgress("kb2");
  });
  function quizDone() {
    onProgress("kb2");
  }
</script>

<div class="container page">
  <div class="kb-nav">
    <button class="btn btn-secondary btn-small" onclick={() => onNav("dashboard")}>← Daftar bab</button>
    <span class="badge">Bab 02</span>
  </div>

  <header class="kb-header" style="margin-top:12px">
    <p class="kicker"><span class="rule"></span>Bab 02</p>
    <h2>Fungsi Kuadrat</h2>
    <p>Lengkung parabola. Pahami titik puncak, sumbu simetri, dan akar-akarnya.</p>
  </header>

  <div class="card materi-body">
    <div class="toc" aria-label="Daftar isi bab">
      {#each MATERI.kb2 as m, i}
        <a href="#kb2-{i}">{String(i + 1).padStart(2, "0")} — {m.judul.replace(/^\d+\.\s*/, "")}</a>
      {/each}
    </div>
    {#each MATERI.kb2 as m, i}
      <section class="materi-section" id="kb2-{i}">
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

  <Grafik judul="Playground: parabola" sub="coba ubah nilai a, b, c dan lihat bentuk lengkungnya." placeholder="x^2-4x+3" contoh={["x^2-4x+3", "-x^2+4", "2x^2-3x+1"]} warna="#173F35" />

  <ContohSoal items={CONTOH_SOAL.kb2} judul="Latihan 02 — Fungsi kuadrat" />

  <Kuis kbId="kb2" items={KUIS.kb2} judul="Kuis 02 — Fungsi kuadrat" onFinish={quizDone} />

  <KbTools kbId="kb2" />

  <div class="kb-nav">
    <button class="btn btn-secondary" onclick={() => onNav("kb1")}>← Bab 01</button>
    <button class="btn btn-primary" onclick={() => onNav("kb3")}>Bab 03 →</button>
  </div>
</div>
