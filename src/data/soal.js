// Contoh soal + pembahasan tiap KB.
export const CONTOH_SOAL = {
  kb1: [
    {
      q: "Diketahui f(x) = 3x − 5. Nilai f(4) adalah …",
      options: ["7", "12", "17", "−7"],
      answer: 0,
      steps: [
        "Substitusi x = 4 ke fungsi.",
        "f(4) = 3(4) − 5 = 12 − 5 = 7.",
      ],
      final: "Jawaban: 7.",
    },
    {
      q: "Gradien garis yang melalui titik (1, 2) dan (5, 10) adalah …",
      options: ["1", "2", "4", "8"],
      answer: 1,
      steps: [
        "Gunakan m = (y₂−y₁)/(x₂−x₁).",
        "m = (10−2)/(5−1) = 8/4 = 2.",
      ],
      final: "Jawaban: 2.",
    },
    {
      q: "Titik potong grafik f(x) = 2x + 6 dengan sumbu X adalah …",
      options: ["(−3, 0)", "(0, 6)", "(3, 0)", "(0, −3)"],
      answer: 0,
      steps: [
        "Potong sumbu X berarti y = 0.",
        "0 = 2x + 6 → 2x = −6 → x = −3.",
        "Titiknya (−3, 0).",
      ],
      final: "Jawaban: (−3, 0).",
    },
  ],
  kb2: [
    {
      q: "Titik puncak parabola f(x) = x² − 4x + 3 adalah …",
      options: ["(2, −1)", "(−2, 11)", "(2, 3)", "(0, 3)"],
      answer: 0,
      steps: [
        "Sumbu simetri x = −b/2a = 4/2 = 2.",
        "y = f(2) = 4 − 8 + 3 = −1.",
        "Puncak (2, −1), minimum karena a > 0.",
      ],
      final: "Jawaban: (2, −1).",
    },
    {
      q: "Akar-akar dari x² − 5x + 6 = 0 adalah …",
      options: ["x = 2 atau x = 3", "x = −2 atau x = −3", "x = 1 atau x = 6", "Tidak punya akar real"],
      answer: 0,
      steps: [
        "Faktorkan: x²−5x+6 = (x−2)(x−3).",
        "Pembuat nol: x = 2 atau x = 3.",
        "Cek D = 25−24 = 1 > 0, jadi 2 akar real.",
      ],
      final: "Jawaban: x = 2 atau x = 3.",
    },
    {
      q: "Agar parabola f(x) = ax² + 4x + 1 terbuka ke bawah, maka …",
      options: ["a < 0", "a > 0", "a = 0", "a ≥ 0"],
      answer: 0,
      steps: [
        "Arah buka ditentukan tanda a.",
        "Terbuka ke bawah (∩) berarti a negatif.",
      ],
      final: "Jawaban: a < 0.",
    },
  ],
  kb3: [
    {
      q: "Diketahui f(x) = 2x + 1 dan g(x) = x². Hasil (f∘g)(x) adalah …",
      options: ["2x² + 1", "(2x+1)²", "4x² + 4x + 1", "x² + 2x + 1"],
      answer: 0,
      steps: [
        "(f∘g)(x) = f(g(x)).",
        "= f(x²) = 2(x²) + 1 = 2x² + 1.",
      ],
      final: "Jawaban: 2x² + 1.",
    },
    {
      q: "Dengan f dan g yang sama, hasil (g∘f)(x) adalah …",
      options: ["(2x+1)² = 4x²+4x+1", "2x²+1", "2x+1+x²", "x²+1"],
      answer: 0,
      steps: [
        "(g∘f)(x) = g(f(x)) = g(2x+1).",
        "= (2x+1)² = 4x² + 4x + 1.",
        "Terbukti f∘g ≠ g∘f.",
      ],
      final: "Jawaban: (2x+1)².",
    },
    {
      q: "Invers dari f(x) = 3x − 6 adalah …",
      options: ["(x+6)/3", "3x+6", "(x−6)/3", "x/3 − 6"],
      answer: 0,
      steps: [
        "y = 3x − 6 → tukar: x = 3y − 6.",
        "3y = x + 6 → y = (x+6)/3.",
      ],
      final: "Jawaban: f⁻¹(x) = (x+6)/3.",
    },
    {
      q: "Manakah yang merupakan fungsi dari A = {1,2,3} ke B = {a,b}?",
      options: [
        "1→a, 2→a, 3→b",
        "1→a, 1→b, 2→a",
        "2→a saja (1 dan 3 tidak punya pasangan)",
        "1→a, 2→b, 2→a",
      ],
      answer: 0,
      steps: [
        "Syarat fungsi: setiap anggota domain tepat satu pasangan.",
        "Hanya opsi pertama yang memenuhi; opsi lain ada yang bercabang/tidak punya pasangan.",
      ],
      final: "Jawaban: 1→a, 2→a, 3→b.",
    },
  ],
  kb4: [
    {
      q: "Daerah x + y ≤ 10 dengan x,y ≥ 0 berada di …",
      options: [
        "Segitiga dengan titik sudut (0,0), (10,0), (0,10)",
        "Seluruh bidang",
        "Garis lurus saja",
        "Kuadran III",
      ],
      answer: 0,
      steps: [
        "Garis batas x+y=10 memotong sumbu di (10,0) dan (0,10).",
        "Uji (0,0): 0 ≤ 10 benar, jadi arsir ke arah origin + batas x,y ≥ 0.",
        "Hasilnya segitiga siku-siku di origin.",
      ],
      final: "Jawaban: segitiga (0,0), (10,0), (0,10).",
    },
    {
      q: "Diketahui Z = 3x + 5y, titik pojok (0,0), (0,10), (4,6), (7,0). Nilai maksimum Z adalah …",
      options: ["42 di (4,6)", "50 di (0,10)", "21 di (7,0)", "0 di (0,0)"],
      answer: 1,
      steps: [
        "Z(0,0)=0; Z(0,10)=50; Z(4,6)=12+30=42; Z(7,0)=21.",
        "Terbesar = 50 di (0,10).",
      ],
      final: "Jawaban: 50 di titik (0,10).",
    },
    {
      q: "Fungsi objektif dalam program linear berfungsi untuk …",
      options: [
        "Menyatakan tujuan yang dimaksimumkan/diminimumkan",
        "Menyatakan kendala bahan",
        "Menggambar sumbu",
        "Menentukan domain fungsi",
      ],
      answer: 0,
      steps: [
        "Fungsi objektif (misal keuntungan) adalah yang dioptimumkan.",
        "Kendala ditulis terpisah sebagai sistem pertidaksamaan.",
      ],
      final: "Jawaban: menyatakan tujuan optimasi.",
    },
  ],
};
