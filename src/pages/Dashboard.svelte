<script>
  import { KB_META } from "../data/materi.js";
  import { kbStatus, kbPercent, getLastLearned, getBookmarks } from "../utils/storage.js";

  let { username = "", progress = null, onNav = () => {}, onReset = () => {} } = $props();

  const ORDER = ["kb1", "kb2", "kb3", "kb4"];

  let studied = $derived(ORDER.filter((id) => progress?.[id]?.visited).length);
  let percent = $derived.by(() => {
    if (!progress) return 0;
    let done = 0;
    for (const id of ORDER) {
      if (progress[id]?.completed) done += 1;
      else if (progress[id]?.visited || progress[id]?.quizScore !== null) done += 0.5;
    }
    return Math.round((done / 4) * 100);
  });

  let last = getLastLearned();
  let marks = getBookmarks();

  function statusText(entry) {
    const s = kbStatus(entry);
    if (s.cls === "done") return "✓ selesai";
    if (s.cls === "doing") return "… sedang dipelajari";
    return "— belum mulai";
  }
</script>

<div class="container page">
  <section class="dash-hero">
    <div>
      <p class="kicker"><span class="rule"></span>Matematika XI • SMK</p>
      <h1>Fungsi tidak harus<br />cuma dihitung.</h1>
      <p class="lead">
        Halo, {username}. Coba, lihat, dan pahami — belajar fungsi lewat grafik,
        perhitungan, contoh soal, dan latihan. Pilih satu bab dan mulai dari sana.
      </p>
      <button class="btn btn-primary" onclick={() => onNav("kb1")}>Mulai belajar →</button>
    </div>
    <div>
      <p class="kicker"><span class="rule"></span>Progress belajar</p>
      <div class="score-big">{percent}<small> / 100</small></div>
      <p style="color:var(--muted);font-size:.9rem;margin:0 0 8px">{studied} dari 4 bab sudah dibuka.</p>
      <div class="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" style="width: {percent}%"></div>
      </div>
      <ul class="progress-list">
        {#each ORDER as id}
          {@const e = progress?.[id]}
          {@const done = e?.completed}
          {@const half = !done && (e?.visited || e?.quizScore !== null)}
          {@const pct = kbPercent(e)}
          <li>
            <span class="tick" class:yes={done} class:half={half}>{done ? "✓" : half ? "…" : "—"}</span>
            <span style="flex:1">
              <span style="display:flex;justify-content:space-between;gap:8px">
                <span>{KB_META[id].no} — {KB_META[id].title}</span>
                <span style="color:var(--muted);font-size:.8rem">{pct}%</span>
              </span>
              <span class="mini-track"><span class="mini-fill" style="width:{pct}%"></span></span>
            </span>
            <span style="color:var(--muted);font-size:.8rem">{statusText(e)}</span>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  {#if last && KB_META[last.kbId]}
    <div class="last-banner">
      <div>
        <p class="kicker" style="margin:0"><span class="rule"></span>Terakhir dipelajari</p>
        <p style="margin:4px 0 0;font-weight:700">
          {KB_META[last.kbId].no} — {KB_META[last.kbId].title}
        </p>
      </div>
      <button class="btn btn-primary btn-small" onclick={() => onNav(KB_META[last.kbId].route)}>Lanjutkan →</button>
    </div>
  {/if}

  <p class="kicker"><span class="rule"></span>Daftar bab</p>
  <div class="chapter-list">
    {#each ORDER as id}
      {@const kb = KB_META[id]}
      {@const e = progress?.[id]}
      <button class="chapter-row" onclick={() => onNav(kb.route)} aria-label="Buka {kb.title}">
        <span class="chapter-no">{kb.no}</span>
        <span>
          <h3>{kb.title}</h3>
          <p>{kb.desc}</p>
          <span class="badge {kbStatus(e).cls}">{statusText(e)}</span>
          {#if e?.quizScore !== null && e?.quizScore !== undefined}
            <span class="badge" style="margin-left:6px">Nilai: {e.quizScore}</span>
          {/if}
          {#if marks[id]}
            <span class="badge" style="margin-left:6px">★ tersimpan</span>
          {/if}
        </span>
        <span class="chapter-open">Buka →</span>
      </button>
    {/each}
  </div>

  <div class="card">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-small" onclick={() => onNav("profil")}>Profil pengembang →</button>
      <button class="btn btn-ghost btn-small" onclick={onReset}>Reset progres</button>
    </div>
    {#if !progress?.kb1?.visited && !progress?.kb2?.visited && !progress?.kb3?.visited && !progress?.kb4?.visited}
      <p class="hint" style="margin-bottom:0">Belum ada progres. Kamu belum mulai belajar — pilih satu bab di atas dan mulai dari sana.</p>
    {/if}
  </div>
</div>
