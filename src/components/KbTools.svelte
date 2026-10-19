<script>
  import { getBookmarks, toggleBookmark, getNote, saveNote } from "../utils/storage.js";

  let { kbId = "kb1" } = $props();

  let marks = $state(getBookmarks());
  let note = $state(getNote(kbId));
  let saved = $state(false);

  function toggle() {
    marks = toggleBookmark(kbId);
  }

  function simpan() {
    saveNote(kbId, note);
    saved = true;
    setTimeout(() => (saved = false), 1600);
  }
</script>

<section class="card kb-tools" aria-label="Bookmark dan catatan">
  <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <button class="btn btn-secondary btn-small" onclick={toggle} aria-pressed={!!marks[kbId]}>
      {marks[kbId] ? "★ Tersimpan" : "☆ Simpan bab ini"}
    </button>
    <span class="hint" style="margin:0">Tersimpan di browser — buka lagi dari dashboard.</span>
  </div>
  <hr class="worksheet-rule" />
  <p class="kicker"><span class="rule"></span>Catatan saya</p>
  <label class="label" for="note-{kbId}" style="margin-top:0">Tulis dengan bahasamu sendiri:</label>
  <textarea
    id="note-{kbId}"
    class="textarea"
    rows="3"
    bind:value={note}
    placeholder='Contoh: ingat, f∘g berarti f(g(x)) — kerjakan g dulu.'
  ></textarea>
  <div style="display:flex;gap:8px;align-items:center;margin-top:8px">
    <button class="btn btn-primary btn-small" onclick={simpan}>Simpan catatan</button>
    {#if saved}
      <span class="badge done">✓ tersimpan</span>
    {/if}
  </div>
</section>
