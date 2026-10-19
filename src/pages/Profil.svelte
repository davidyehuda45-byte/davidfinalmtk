<script>
  let {
    nama = "David Yehuda Surbakti",
    kelas = "XI RPL (Rekayasa Perangkat Lunak)",
    sekolah = "SMK Bagimu Negeriku",
    kota = "Semarang",
    inisial = "D",
  } = $props();
</script>

<div class="container page">
  <div class="kb-nav">
    <span class="badge">Profil</span>
  </div>
  <div class="card profil-hero" style="margin-top:12px">
    <div class="avatar">ƒ</div>
    <p class="kicker"><span class="rule"></span>Pengembang</p>
    <h2 style="margin:0 0 4px;font-size:1.6rem">{nama}</h2>
    <p style="color:var(--muted);margin:0">Kelas {kelas}</p>
    <p style="color:var(--muted);margin:0 0 12px">{sekolah}, {kota} ({inisial})</p>
    <p style="max-width:560px;margin:0 0 12px">
      Website ini dibuat sebagai projek ASTS untuk membantu siswa belajar matematika
      secara mandiri — membaca bab, mencoba grafik di playground, menghitung komposisi
      di lembar kerja, lalu menguji pemahaman lewat kuis mini.
    </p>
    <div class="tech-list" aria-label="Teknologi yang digunakan">
      <span>Svelte</span>
      <span>JavaScript</span>
      <span>HTML</span>
      <span>CSS</span>
      <span>Canvas</span>
      <span>localStorage</span>
    </div>
  </div>

  <div class="card">
    <p class="kicker"><span class="rule"></span>Tujuan</p>
    <h3 class="section-title">Kenapa website ini dibuat</h3>
    <ul>
      <li>Membantu siswa SMK belajar materi fungsi secara mandiri.</li>
      <li>Membuat grafik fungsi bisa dicoba langsung, bukan cuma dilihat.</li>
      <li>Menunjukkan langkah komposisi fungsi, bukan cuma hasil akhir.</li>
      <li>Memberi latihan dan kuis dengan nilai otomatis.</li>
    </ul>
    <p class="hint">Catatan: login dan progres tersimpan di browser (localStorage), tanpa database — sesuai scope projek ASTS.</p>
  </div>
</div>
