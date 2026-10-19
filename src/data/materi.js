// Data materi tiap KB — mudah diedit guru/siswa.
export const KB_META = {
  kb1: {
    id: "kb1",
    no: "01",
    title: "Fungsi Linear",
    desc: "Garis, gradien, titik potong, dan pola linear.",
    route: "kb1",
  },
  kb2: {
    id: "kb2",
    no: "02",
    title: "Fungsi Kuadrat",
    desc: "Parabola, titik puncak, sumbu simetri, dan akar.",
    route: "kb2",
  },
  kb3: {
    id: "kb3",
    no: "03",
    title: "Komposisi & Invers",
    desc: "f(g(x)), g(f(x)), tiga fungsi, dan invers.",
    route: "kb3",
  },
  kb4: {
    id: "kb4",
    no: "04",
    title: "Program Linear",
    desc: "Pertidaksamaan, daerah penyelesaian, titik pojok.",
    route: "kb4",
  },
};

export const MATERI = {
  kb1: [
    {
      judul: "1. Pengertian Fungsi Linear",
      isi: [
        "Fungsi linear adalah fungsi yang grafiknya berupa garis lurus.",
        "Ciri paling mudah: pangkat tertinggi dari x adalah 1 (tidak ada x², √x, atau 1/x).",
      ],
      rumus: ["f(x) = mx + c"],
      list: [
        "m = gradien (kemiringan garis). Jika m > 0 garis naik, jika m < 0 garis turun.",
        "c = titik potong dengan sumbu Y, yaitu nilai f(0).",
        "Contoh: f(x) = 2x + 3 → gradien 2, memotong sumbu Y di (0, 3).",
      ],
    },
    {
      judul: "2. Domain dan Range (Sederhana)",
      isi: [
        "Domain = semua nilai x yang boleh dimasukkan. Untuk fungsi linear, domainnya semua bilangan real.",
        "Range = semua nilai y hasil fungsi. Untuk fungsi linear (selain konstan), rangenya juga semua bilangan real.",
      ],
      rumus: ["D = { x | x ∈ ℝ }", "R = { y | y ∈ ℝ }"],
    },
    {
      judul: "3. Gradien",
      isi: [
        "Gradien menyatakan seberapa curam garis. Dari dua titik (x₁,y₁) dan (x₂,y₂):",
      ],
      rumus: ["m = (y₂ − y₁) / (x₂ − x₁)", "Jika diketahui persamaan y = mx + c, maka gradien = m"],
      list: [
        "Contoh: garis melalui (0,3) dan (2,7) → m = (7−3)/(2−0) = 2.",
        "Garis yang sejajar memiliki gradien sama. Garis tegak lurus: m₁ × m₂ = −1.",
      ],
    },
    {
      judul: "4. Titik Potong Sumbu",
      isi: ["Setiap garis lurus memotong sumbu koordinat di maksimal dua titik."],
      rumus: ["Potong sumbu Y: masukkan x = 0 → y = c", "Potong sumbu X: masukkan y = 0 → x = −c/m"],
      list: ["Contoh f(x)=2x+3: potong Y di (0,3). Potong X: 0=2x+3 → x=−1,5."],
    },
    {
      judul: "5. Menentukan Persamaan Garis",
      isi: ["Tiga cara paling sering keluar di soal SMK:"],
      list: [
        "Diketahui gradien m dan satu titik (x₁,y₁): y − y₁ = m(x − x₁).",
        "Diketahui dua titik: cari m dulu, lalu gunakan cara pertama.",
        "Diketahui potongan sumbu X di (a,0) dan sumbu Y di (0,b): x/a + y/b = 1.",
      ],
      rumus: ["y − y₁ = m(x − x₁)"],
    },
    {
      judul: "6. Penerapan Sehari-hari",
      isi: ["Fungsi linear banyak dipakai di dunia SMK:"],
      list: [
        "Ongkos ojek: Rp5.000 buka pintu + Rp2.000/km → f(x) = 2000x + 5000.",
        "Biaya fotokopi: Rp200/lembar → f(x) = 200x.",
        "Gaji + komisi penjualan, tagihan listrik bertingkat (bagian linearnya), dan konversi suhu.",
      ],
    },
  ],
  kb2: [
    {
      judul: "1. Pengertian & Bentuk Umum",
      isi: [
        "Fungsi kuadrat adalah fungsi dengan pangkat tertinggi x². Grafiknya berbentuk parabola (lengkung U).",
      ],
      rumus: ["f(x) = ax² + bx + c, dengan a ≠ 0"],
      list: [
        "a menentukan arah buka: a > 0 terbuka ke atas (∪), a < 0 terbuka ke bawah (∩).",
        "Semakin besar |a|, parabola semakin ramping/menyempit.",
        "c = titik potong dengan sumbu Y.",
      ],
    },
    {
      judul: "2. Sumbu Simetri & Titik Puncak",
      isi: ["Parabola simetris terhadap garis vertikal yang disebut sumbu simetri."],
      rumus: [
        "Sumbu simetri: x = −b / 2a",
        "Nilai optimum: y = f(−b/2a)  atau  y = (4ac − b²) / 4a",
        "Titik puncak: (−b/2a, (4ac−b²)/4a)",
      ],
      list: [
        "Contoh f(x)=x²−4x+3: sumbu simetri x=2, puncak (2,−1), nilai minimum −1.",
        "Jika a>0 → puncak adalah titik minimum. Jika a<0 → titik maksimum.",
      ],
    },
    {
      judul: "3. Titik Potong & Akar",
      isi: ["Titik potong dengan sumbu Y: (0,c). Titik potong dengan sumbu X = akar persamaan ax²+bx+c=0."],
      rumus: ["x = (−b ± √(b²−4ac)) / 2a", "D = b² − 4ac (diskriminan)"],
      list: [
        "D > 0: memotong sumbu X di 2 titik.",
        "D = 0: menyinggung sumbu X di 1 titik (puncak di sumbu X).",
        "D < 0: tidak memotong sumbu X.",
      ],
    },
    {
      judul: "4. Cara Menggambar Parabola (Langkah Cepat)",
      isi: ["Urutan yang disarankan saat ujian:"],
      list: [
        "1. Tentukan arah buka dari tanda a.",
        "2. Cari titik potong sumbu Y (0,c).",
        "3. Cari akar/D untuk potongan sumbu X.",
        "4. Hitung sumbu simetri & titik puncak.",
        "5. Ambil 1–2 titik bantu di kiri-kanan puncak, lalu hubungkan mulus.",
      ],
    },
    {
      judul: "5. Penerapan",
      isi: ["Gerak bola yang dilempar, bentuk jembatan lengkung, keuntungan maksimum (ekonomi), dan desain atap/gapura."],
    },
  ],
  kb3: [
    {
      judul: "1. Pengertian Fungsi & Pemetaan",
      isi: [
        "Relasi dari himpunan A ke B memasangkan anggota A dengan anggota B.",
        "Fungsi (pemetaan) adalah relasi khusus: setiap anggota A punya tepat satu pasangan di B.",
      ],
      list: [
        "Domain = daerah asal (himpunan A). Kodomain = daerah kawan (himpunan B). Range = hasil nyata yang terpasangkan.",
        "Cara cek diagram panah: tidak boleh ada anak panah yang bercabang dari satu anggota domain.",
        "Uji garis vertikal pada grafik: garis vertikal hanya boleh memotong grafik tepat sekali agar merupakan fungsi.",
      ],
    },
    {
      judul: "2. Fungsi Satu-satu (Injektif)",
      isi: [
        "Fungsi satu-satu: anggota B yang berbeda selalu berasal dari anggota A yang berbeda.",
        "Sederhananya: tidak ada dua x berbeda yang menghasilkan y sama (kecuali fungsi itu memang tidak injektif).",
      ],
      list: ["Contoh injektif: f(x)=2x+1. Bukan injektif: f(x)=x² (karena f(2)=f(−2))."],
    },
    {
      judul: "3. Fungsi Komposisi",
      isi: [
        "Komposisi = menggabungkan dua fungsi: hasil fungsi dalam menjadi masukan fungsi luar.",
        "Dibaca (f∘g)(x) = f(g(x)): kerjakan g dulu, hasilnya masukkan ke f.",
      ],
      rumus: ["(f ∘ g)(x) = f(g(x))", "(g ∘ f)(x) = g(f(x))", "(f ∘ g ∘ h)(x) = f(g(h(x)))"],
      list: [
        "Urutan penting! Umumnya f∘g ≠ g∘f.",
        "Contoh: f(x)=2x+1, g(x)=x² → (f∘g)(x)=2x²+1, sedangkan (g∘f)(x)=(2x+1)²=4x²+4x+1.",
        "Gunakan kalkulator di bawah untuk melihat langkah substitusinya.",
      ],
    },
    {
      judul: "4. Fungsi Invers",
      isi: [
        "Invers = kebalikan fungsi. Jika f(a)=b maka f⁻¹(b)=a.",
        "Syarat punya invers: fungsi harus satu-satu (bijektif agar inversnya juga fungsi).",
      ],
      rumus: ["Langkah: y = f(x) → tukar x↔y → selesaikan untuk y", "Linear f(x)=ax+b → f⁻¹(x) = (x−b)/a"],
      list: [
        "Contoh: f(x)=2x+3 → y=2x+3 → x=2y+3 → y=(x−3)/2. Jadi f⁻¹(x)=(x−3)/2.",
        "Grafik f dan f⁻¹ simetris terhadap garis y=x.",
      ],
    },
  ],
  kb4: [
    {
      judul: "1. Pengertian Program Linear",
      isi: [
        "Program linear = cara menentukan nilai terbaik (maksimum/minimum) dengan kendala berupa pertidaksamaan linear.",
        "Dipakai untuk optimasi: keuntungan terbesar, biaya terkecil, bahan minimal, dsb.",
      ],
      list: [
        "Variabel keputusan: misal x = jumlah roti A, y = jumlah roti B.",
        "Fungsi objektif (tujuan): misal Z = 5000x + 7000y (keuntungan).",
        "Kendala: keterbatasan bahan, waktu, tempat → ditulis sebagai pertidaksamaan.",
      ],
    },
    {
      judul: "2. Pertidaksamaan Linear Dua Variabel",
      isi: ["Bentuk umum ax + by ≤ c (atau ≥, <, >). Himpunannya berupa setengah bidang yang dibatasi garis ax+by=c."],
      rumus: ["Garis batas: ax + by = c", "Uji titik (0,0): jika memenuhi, arsir daerah yang memuat (0,0)"],
      list: [
        "Contoh: x+y ≤ 10 → garis x+y=10, uji (0,0): 0≤10 benar → arsir ke arah (0,0).",
        "x ≥ 0, y ≥ 0 berarti hanya kuadran I yang dipakai.",
      ],
    },
    {
      judul: "3. Sistem & Daerah Penyelesaian",
      isi: [
        "Daerah penyelesaian (DHP) = irisan semua kendala. Digambar sebagai daerah arsir pada grafik.",
        "Gunakan visualisasi di bawah: garis berwarna = garis batas, arsir ungu = DHP.",
      ],
      rumus: ["Contoh sistem:", "x + y ≤ 10", "2x + y ≤ 14", "x ≥ 0, y ≥ 0"],
    },
    {
      judul: "4. Titik Pojok & Nilai Optimum",
      isi: ["Nilai optimum selalu ada di titik pojok (titik sudut) DHP — tidak perlu cek titik tengah."],
      list: [
        "1. Gambar DHP.",
        "2. Cari koordinat semua titik pojok (perpotongan garis batas).",
        "3. Substitusi tiap titik pojok ke fungsi objektif Z.",
        "4. Pilih terbesar untuk maksimum, terkecil untuk minimum.",
        "Contoh: Z=3x+5y dengan DHP dari sistem di atas → cek (0,0),(0,10),(4,6),(7,0) → maksimum di (4,6): Z=42.",
      ],
    },
    {
      judul: "5. Penerapan",
      isi: ["Menentukan produksi agar untung maksimal, menu diet biaya minimal, penjadwalan mesin, dan campuran bahan."],
    },
  ],
};
