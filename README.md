# MathLearn SMK — Website Pembelajaran Fungsi Matematika Interaktif

Media belajar matematika untuk **siswa kelas XI SMK semua jurusan**:
materi 4 KB, grafik playground animasi, kalkulator komposisi + invers,
contoh soal berpembahasan, kuis bernilai otomatis, dan progres belajar.
Dibangun dengan **Svelte + Vite** (tanpa database, data tersimpan di `localStorage`).

Pengembang: **David Yehuda Surbakti** — XI RPL (Rekayasa Perangkat Lunak),
SMK Bagimu Negeriku, Semarang.

## Cara menjalankan

```powershell
npm install
npm run dev      # mode pengembangan
npm run build    # build produksi ke dist/
npm run preview  # cek hasil build
```

## Akun demo

- Username: `siswa`
- Password: `belajar123`

Username lain juga bisa dipakai (min. 3 karakter).

## Struktur penting

```text
src/
├── pages/        # Login, Dashboard, Kb1–Kb4, Profil
├── components/   # Navbar, Grafik, Kalkulator, ContohSoal, Kuis,
│                 # ProgramLinearGraph, ProgressBar, KbTools
├── data/         # materi.js, soal.js, kuis.js (mudah diedit)
└── utils/        # calculator.js (parser + komposisi + invers),
                  # graph.js (engine grafik canvas),
                  # storage.js (auth, progres, bookmark, catatan)
```

## Deploy ke Vercel

1. Push projek ke GitHub.
2. Import repository di Vercel (framework: Vite, output: `dist/`).
3. File `vercel.json` sudah disiapkan.

## Checklist uji manual (sebelum presentasi ASTS)

- [ ] Login kosong → pesan error; login salah → pesan error
- [ ] Login `siswa / belajar123` → masuk dashboard
- [ ] Buka KB 1–4, grafik digambar dengan animasi, zoom/pan/reset
- [ ] Kalkulator: `f=2x+1, g=x²` → `f∘g = 2(x²)+1`
- [ ] Kerjakan tiap kuis → nilai + progres tersimpan (refresh browser)
- [ ] Logout → kembali ke login; login lagi → progres masih ada
- [ ] Cek di HP (satu kolom, tombol mudah disentuh) dan laptop
