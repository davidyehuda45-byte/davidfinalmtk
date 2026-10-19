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
    onProgress("kb1");
  });

  function quizDone() {
    onProgress("kb1");
  }
</script>

<div class="container page">
  <div class="kb-nav">
    <button class="btn btn-secondary btn-small" onclick={() => onNav("dashboard")}>← Daftar bab</button>
    <span class="badge">Bab 01</span>
  </div>

  <header class="kb-header" style="margin-top:12px">
    <p class="kicker"><span class="rule"></span>Bab 01</p>
    <h2>Fungsi Linear</h2>
    <p>Garis yang punya pola. Pahami bentuk umum, gradien, titik potong, lalu coba grafiknya.</p>
  </header>

  <div class="card materi-body">
    <div class="toc" aria-label="Daftar isi bab">
      {#each MATERI.kb1 as m, i}
        <a href="#kb1-{i}">{String(i + 1).padStart(2, "0")} — {m.judul.replace(/^\d+\.\s*/, "")}</a>
      {/each}
    </div>
    {#each MATERI.kb1 as m, i}
      <section class="materi-section" id="kb1-{i}">
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

  <Grafik judul="Playground: garis lurus" sub="coba ganti angka pada fungsi linear dan lihat kemiringannya." placeholder="2x+3" contoh={["2x+3", "-x+5", "0.5x-2"]} warna="#173F35" />

  <ContohSoal items={CONTOH_SOAL.kb1} judul="Latihan 01 — Fungsi linear" />

  <Kuis kbId="kb1" items={KUIS.kb1} judul="Kuis 01 — Fungsi linear" onFinish={quizDone} />

  <KbTools kbId="kb1" />

  <div class="kb-nav">
    <button class="btn btn-secondary" onclick={() => onNav("dashboard")}>← Daftar bab</button>
    <button class="btn btn-primary" onclick={() => onNav("kb2")}>Bab 02 →</button>
  </div>
</div>
