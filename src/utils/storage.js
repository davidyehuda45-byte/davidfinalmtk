// Penyimpanan localStorage sederhana (tanpa database).
const KEYS = {
  auth: "mathlearn_auth",
  progress: "mathlearn_progress",
  quiz: "mathlearn_quiz_history",
  last: "mathlearn_last",
  bookmarks: "mathlearn_bookmarks",
  notes: "mathlearn_notes",
};

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEYS.auth);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(data) {
  localStorage.setItem(KEYS.auth, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(KEYS.auth);
}

export function isLoggedIn() {
  return !!getAuth()?.username;
}

const DEFAULT_PROGRESS = {
  kb1: { visited: false, quizScore: null, completed: false },
  kb2: { visited: false, quizScore: null, completed: false },
  kb3: { visited: false, quizScore: null, completed: false },
  kb4: { visited: false, quizScore: null, completed: false },
};

export function getProgress() {
  try {
    const raw = localStorage.getItem(KEYS.progress);
    if (!raw) return structuredClone(DEFAULT_PROGRESS);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT_PROGRESS), ...parsed };
  } catch {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

export function setProgress(p) {
  localStorage.setItem(KEYS.progress, JSON.stringify(p));
}

export function markVisited(kbId) {
  const p = getProgress();
  if (p[kbId]) {
    p[kbId].visited = true;
    // selesai jika sudah ada nilai kuis
    if (p[kbId].quizScore !== null && p[kbId].quizScore >= 60) p[kbId].completed = true;
    else if (p[kbId].visited) p[kbId] = { ...p[kbId] };
    setProgress(p);
  }
  setLastLearned(kbId);
  return p;
}

export function saveQuizScore(kbId, score) {
  const p = getProgress();
  if (p[kbId]) {
    p[kbId].quizScore = score;
    p[kbId].visited = true;
    p[kbId].completed = score >= 60;
    setProgress(p);
  }
  // riwayat
  try {
    const raw = localStorage.getItem(KEYS.quiz);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ kbId, score, date: new Date().toISOString() });
    localStorage.setItem(KEYS.quiz, JSON.stringify(arr.slice(-50)));
  } catch { /* abaikan */ }
  setLastLearned(kbId);
  return p;
}

export function getQuizHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.quiz) || "[]");
  } catch {
    return [];
  }
}

export function resetProgress() {
  localStorage.removeItem(KEYS.progress);
  localStorage.removeItem(KEYS.quiz);
  return structuredClone(DEFAULT_PROGRESS);
}

export function progressPercent(progress) {
  const ids = ["kb1", "kb2", "kb3", "kb4"];
  let done = 0;
  for (const id of ids) {
    if (progress[id]?.completed) done += 1;
    else if (progress[id]?.visited || progress[id]?.quizScore !== null) done += 0.5;
  }
  return Math.round((done / 4) * 100);
}

/** Persen per KB untuk bilah progres dashboard. */
export function kbPercent(entry) {
  if (!entry) return 0;
  if (entry.completed) return 100;
  if (entry.quizScore !== null && entry.quizScore !== undefined) return entry.quizScore;
  if (entry.visited) return 10;
  return 0;
}

/* ---------- Terakhir dipelajari ---------- */
export function getLastLearned() {
  try {
    const raw = localStorage.getItem(KEYS.last);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastLearned(kbId) {
  try {
    localStorage.setItem(KEYS.last, JSON.stringify({ kbId, at: new Date().toISOString() }));
  } catch { /* abaikan */ }
}

/* ---------- Bookmark materi ---------- */
const DEFAULT_BOOKMARKS = { kb1: false, kb2: false, kb3: false, kb4: false };

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(KEYS.bookmarks);
    if (!raw) return { ...DEFAULT_BOOKMARKS };
    return { ...DEFAULT_BOOKMARKS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_BOOKMARKS };
  }
}

export function toggleBookmark(kbId) {
  const b = getBookmarks();
  b[kbId] = !b[kbId];
  try {
    localStorage.setItem(KEYS.bookmarks, JSON.stringify(b));
  } catch { /* abaikan */ }
  return b;
}

/* ---------- Catatan saya ---------- */
export function getNote(kbId) {
  try {
    const raw = localStorage.getItem(KEYS.notes);
    if (!raw) return "";
    return JSON.parse(raw)[kbId] || "";
  } catch {
    return "";
  }
}

export function saveNote(kbId, text) {
  try {
    const raw = localStorage.getItem(KEYS.notes);
    const obj = raw ? JSON.parse(raw) : {};
    obj[kbId] = text;
    localStorage.setItem(KEYS.notes, JSON.stringify(obj));
  } catch { /* abaikan */ }
}

export function kbStatus(entry) {
  if (!entry) return { label: "Belum mulai", cls: "todo" };
  if (entry.completed) return { label: "Selesai", cls: "done" };
  if (entry.visited || entry.quizScore !== null) return { label: "Sedang belajar", cls: "doing" };
  return { label: "Belum mulai", cls: "todo" };
}
