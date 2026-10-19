<script>
  import { MATERI } from "../data/materi.js";
  import { CONTOH_SOAL } from "../data/soal.js";
  import { KUIS } from "../data/kuis.js";
  import ProgramLinearGraph from "../components/ProgramLinearGraph.svelte";
  import ContohSoal from "../components/ContohSoal.svelte";
  import Kuis from "../components/Kuis.svelte";
  import KbTools from "../components/KbTools.svelte";

  let { onNav = () => {}, onProgress = () => {} } = $props();

  $effect(() => {
    onProgress("kb4");
  });
  function quizDone() {
    onProgress("kb4");
  }
</script>

<div class="container page">
  <div class="kb-nav">
    <button class="btn btn-secondary btn-small" onclick={() => onNav("dashboard")}>← Daftar bab</button>
    <span class="badge">Bab 04</span>
  </div>

  <header class="kb-header" style="margin-top:12px">
    <p class="kicker"><span class="rule"></span>Bab 04</p>
    <h2>Program Linear</h2>
    <p>Mencari yang paling untung. Gambar daerahnya, cek titik pojok, tentukan optimum.</p>
  </header>

  <div class="card materi-body">
    <div class="toc" aria-label="Daftar isi bab">
      {#each MATERI.kb4 as m, i}
        <a href="#kb4-{i}">{String(i + 1).padStart(2, "0")} — {m.judul.replace(/^\d+\.\s*/, "")}</a>
      {/each}
    </div>
    {#each MATERI.kb4 as m, i}
      <section class="materi-section" id="kb4-{i}">
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

  <ProgramLinearGraph />

  <ContohSoal items={CONTOH_SOAL.kb4} judul="Latihan 04 — Program linear" />

  <Kuis kbId="kb4" items={KUIS.kb4} judul="Kuis 04 — Program linear" onFinish={quizDone} />

  <KbTools kbId="kb4" />

  <div class="kb-nav">
    <button class="btn btn-secondary" onclick={() => onNav("kb3")}>← Bab 03</button>
    <button class="btn btn-primary" onclick={() => onNav("profil")}>Profil pengembang →</button>
  </div>
</div>
