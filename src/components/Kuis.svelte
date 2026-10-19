<script>
  import { saveQuizScore } from "../utils/storage.js";

  let { kbId = "kb1", items = [], judul = "Kuis", onFinish = () => {} } = $props();

  let mulai = $state(false);
  let idx = $state(0);
  let jawaban = $state({});
  let selesai = $state(false);
  let nilai = $state(0);
  let benar = $state(0);
  let review = $state(false);

  function start() {
    mulai = true;
    idx = 0;
    jawaban = {};
    selesai = false;
    nilai = 0;
    benar = 0;
    review = false;
  }

  function pilih(o) {
    if (selesai) return;
    jawaban[idx] = o;
  }

  function next() {
    if (idx < items.length - 1) idx += 1;
  }
  function prev() {
    if (idx > 0) idx -= 1;
  }

  function finish() {
    let b = 0;
    items.forEach((s, i) => {
      if (jawaban[i] === s.answer) b += 1;
    });
    benar = b;
    nilai = Math.round((b / items.length) * 100);
    selesai = true;
    saveQuizScore(kbId, nilai);
    onFinish(nilai);
  }

  function pesan(n) {
    if (n === 100) return "Sempurna. Kamu menguasai materi ini — pertahankan.";
    if (n >= 80) return "Bagus. Kamu sudah memahami sebagian besar materi ini.";
    if (n >= 60) return "Cukup. Pelajari lagi bagian yang salah, lalu coba sekali lagi.";
    return "Belum tuntas. Baca ulang materi dan contoh soal, lalu coba lagi.";
  }

  let soal = $derived(items[idx]);
  let terjawab = $derived(Object.keys(jawaban).length);
</script>

<section class="card" aria-label={judul}>
  <div class="exam-head">
    <div>
      <p class="kicker" style="margin:0"><span class="rule"></span>Kuis mini</p>
      <h3 class="section-title" style="margin-top:4px">{judul}</h3>
    </div>
    {#if mulai && !selesai}
      <span class="exam-count">{String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
    {/if}
  </div>

  {#if !mulai}
    <p class="section-sub">{items.length} soal pilihan ganda. Nilai dihitung otomatis dan disimpan ke progres belajarmu.</p>
    <button class="btn btn-primary btn-block" onclick={start}>Mulai kuis →</button>
  {:else if !selesai}
    <div class="quiz-progress" aria-label="Kemajuan kuis">
      {#each items as _, i}
        <div class="quiz-dot" class:done={jawaban[i] !== undefined} class:current={i === idx}></div>
      {/each}
    </div>
    <p style="color:var(--muted);font-size:.88rem">Soal {idx + 1} dari {items.length} • Terjawab: {terjawab}/{items.length}</p>
    <h4 style="margin:8px 0;font-size:1.05rem">{soal.q}</h4>
    {#each soal.options as opt, o}
      <button class="quiz-opt" class:selected={jawaban[idx] === o} onclick={() => pilih(o)} aria-pressed={jawaban[idx] === o}>
        <span class="radio" aria-hidden="true"></span>
        <span><b>{String.fromCharCode(65 + o)}.</b> {opt}</span>
      </button>
    {/each}
    <div class="graph-row" style="margin-top:10px">
      <button class="btn btn-secondary" onclick={prev} disabled={idx === 0}>← Sebelumnya</button>
      {#if idx < items.length - 1}
        <button class="btn btn-primary" onclick={next}>Lanjut →</button>
      {:else}
        <button class="btn btn-primary" onclick={finish}>Selesai — hitung nilai</button>
      {/if}
    </div>
  {:else}
    <div class="score-sheet">
      <p class="kicker"><span class="rule"></span>Selesai</p>
      <div class="score-big">{benar} / {items.length}<small> benar</small></div>
      <div class="score-big" style="font-size:2rem">{nilai}<small> / 100 nilai</small></div>
      <p style="color:var(--muted)">{pesan(nilai)}</p>
      <div class="graph-row" style="margin-top:12px">
        <button class="btn btn-secondary" onclick={() => (review = !review)}>
          {review ? "Tutup pembahasan" : "Lihat pembahasan"}
        </button>
        <button class="btn btn-secondary" onclick={start}>Ulangi kuis</button>
      </div>
    </div>
    {#if review}
      <hr class="worksheet-rule" />
      {#each items as s, i}
        <div class="soal-item" style={jawaban[i] === s.answer ? "border-left-color:var(--success)" : "border-left-color:var(--danger)"}>
          <h4><span class="no">{String(i + 1).padStart(2, "0")}</span>{s.q}</h4>
          <p style="font-size:.9rem">Jawabanmu: <b>{jawaban[i] !== undefined ? s.options[jawaban[i]] : "— (tidak dijawab)"}</b>
            {jawaban[i] === s.answer ? "✓" : "✕"}</p>
          <p style="font-size:.9rem">Kunci: <b>{s.options[s.answer]}</b></p>
          <p style="font-size:.9rem;color:var(--muted)">{s.explain}</p>
        </div>
      {/each}
    {/if}
  {/if}
</section>
