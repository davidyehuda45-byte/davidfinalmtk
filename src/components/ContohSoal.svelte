<script>
  let { items = [], judul = "Latihan", sub = "Coba jawab sendiri dulu, baru buka pembahasannya." } = $props();
  let terbuka = $state({});

  function toggle(i) {
    terbuka[i] = !terbuka[i];
  }
</script>

<section class="card worksheet" aria-label={judul}>
  <p class="kicker"><span class="rule"></span>Worksheet</p>
  <h3 class="section-title">{judul}</h3>
  <p class="section-sub">{sub}</p>

  {#each items as soal, i}
    <article class="soal-item">
      <h4><span class="no">{String(i + 1).padStart(2, "0")}</span>{soal.q}</h4>
      {#if soal.options}
        <ul class="soal-opts">
          {#each soal.options as opt, j}
            <li class:key={j === soal.answer}>
              <b>{String.fromCharCode(65 + j)}.</b> {opt}
              {#if j === soal.answer} ✓{/if}
            </li>
          {/each}
        </ul>
      {/if}
      <button class="btn btn-secondary btn-small" onclick={() => toggle(i)} aria-expanded={!!terbuka[i]}>
        {terbuka[i] ? "Tutup pembahasan ↑" : "Tampilkan pembahasan ↓"}
      </button>
      {#if terbuka[i]}
        <div class="pembahasan">
          <b>Pembahasan:</b>
          <ol>
            {#each soal.steps as s}
              <li>{s}</li>
            {/each}
          </ol>
          <b>{soal.final}</b>
        </div>
      {/if}
    </article>
  {/each}
</section>
