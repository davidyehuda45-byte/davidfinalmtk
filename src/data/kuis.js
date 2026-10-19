// Kuis tiap KB: minimal 5 soal, pilihan ganda, 1 jawaban benar.
export const KUIS = {
  kb1: [
    {
      q: "Bentuk umum fungsi linear adalah …",
      options: ["f(x) = mx + c", "f(x) = ax² + bx + c", "f(x) = a/x", "f(x) = √x"],
      answer: 0,
      explain: "Fungsi linear berpangkat 1: f(x)=mx+c.",
    },
    {
      q: "Gradien dari f(x) = −4x + 7 adalah …",
      options: ["−4", "7", "4", "−7"],
      explain: "Pada y=mx+c, gradien = m = −4.",
      answer: 0,
    },
    {
      q: "Titik potong f(x) = 5x − 10 dengan sumbu Y adalah …",
      options: ["(0, −10)", "(2, 0)", "(0, 5)", "(−10, 0)"],
      answer: 0,
      explain: "Masukkan x=0 → y=−10.",
    },
    {
      q: "Persamaan garis bergradien 2 melalui (1, 3) adalah …",
      options: ["y = 2x + 1", "y = 2x + 3", "y = x + 3", "y = 2x − 3"],
      answer: 0,
      explain: "y−3=2(x−1) → y=2x+1.",
    },
    {
      q: "Biaya fotokopi Rp200/lembar. Fungsi biaya untuk x lembar adalah …",
      options: ["f(x) = 200x", "f(x) = x + 200", "f(x) = 200/x", "f(x) = 200"],
      answer: 0,
      explain: "Biaya = 200 dikali banyak lembar.",
    },
  ],
  kb2: [
    {
      q: "Bentuk umum fungsi kuadrat adalah …",
      options: ["f(x) = ax² + bx + c, a≠0", "f(x) = mx + c", "f(x) = ax + b/x", "f(x) = m/x"],
      answer: 0,
      explain: "Ciri kuadrat: ada suku x² dengan a≠0.",
    },
    {
      q: "Sumbu simetri f(x) = x² + 6x + 5 adalah …",
      options: ["x = −3", "x = 3", "x = 5", "x = −5"],
      answer: 0,
      explain: "x=−b/2a=−6/2=−3.",
    },
    {
      q: "Titik puncak f(x) = x² − 2x − 8 adalah …",
      options: ["(1, −9)", "(−1, −5)", "(1, 9)", "(2, −8)"],
      answer: 0,
      explain: "x=1, y=1−2−8=−9.",
    },
    {
      q: "Diskriminan x² − 4x + 4 adalah …",
      options: ["0", "16", "−16", "8"],
      answer: 0,
      explain: "D=16−16=0 → menyinggung sumbu X.",
    },
    {
      q: "Parabola f(x) = −2x² + 3x + 1 terbuka ke …",
      options: ["Bawah (∩)", "Atas (∪)", "Kanan", "Kiri"],
      answer: 0,
      explain: "a=−2<0 → terbuka ke bawah, punya maksimum.",
    },
  ],
  kb3: [
    {
      q: "Jika f(x)=x+2 dan g(x)=3x, maka (f∘g)(x) = …",
      options: ["3x + 2", "3x + 6", "x + 6", "3(x+2)²"],
      answer: 0,
      explain: "f(g(x))=f(3x)=3x+2.",
    },
    {
      q: "(g∘f)(x) untuk fungsi yang sama adalah …",
      options: ["3x + 6", "3x + 2", "x + 5", "9x"],
      answer: 0,
      explain: "g(f(x))=3(x+2)=3x+6. Beda dengan f∘g!",
    },
    {
      q: "Invers dari f(x) = x + 5 adalah …",
      options: ["x − 5", "x + 5", "5 − x", "1/(x+5)"],
      answer: 0,
      explain: "y=x+5 → x=y+5 → y=x−5.",
    },
    {
      q: "Syarat suatu relasi disebut fungsi adalah …",
      options: [
        "Setiap anggota domain tepat satu pasangan",
        "Setiap anggota kodomain punya pasangan",
        "Ada anggota domain bercabang",
        "Domain boleh kosong",
      ],
      answer: 0,
      explain: "Fungsi = tidak bercabang dari sisi domain.",
    },
    {
      q: "Jika f(x)=2x−4 dan (f∘g)(x)=2x²−4, maka g(x)= …",
      options: ["x²", "x²−4", "2x", "x+2"],
      answer: 0,
      explain: "f(g)=2g−4=2x²−4 → g=x².",
    },
  ],
  kb4: [
    {
      q: "Bentuk yang termasuk pertidaksamaan linear dua variabel adalah …",
      options: ["2x + 3y ≤ 12", "x² + y ≤ 5", "1/x + y ≥ 2", "√x + y ≤ 3"],
      answer: 0,
      explain: "Linear: pangkat variabel 1, tidak ada pecahan/akar.",
    },
    {
      q: "Garis batas dari 2x + y ≤ 14 memotong sumbu Y di …",
      options: ["(0, 14)", "(7, 0)", "(0, 7)", "(14, 0)"],
      answer: 0,
      explain: "Masukkan x=0 → y=14.",
    },
    {
      q: "Daerah x ≥ 0, y ≥ 0 adalah …",
      options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
      answer: 0,
      explain: "x dan y non-negatif = kuadran I.",
    },
    {
      q: "Nilai optimum program linear dicari di …",
      options: ["Titik pojok DHP", "Titik tengah DHP", "Sembarang titik garis", "Titik (0,0) saja"],
      answer: 0,
      explain: "Teorema titik pojok: optimum selalu di sudut DHP.",
    },
    {
      q: "Z = 4x + 3y. Z(2, 5) = …",
      options: ["23", "17", "20", "10"],
      answer: 0,
      explain: "Z=8+15=23.",
    },
  ],
};
