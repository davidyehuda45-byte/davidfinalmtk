<script>
  import Navbar from "./components/Navbar.svelte";
  import Login from "./pages/Login.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Kb1 from "./pages/Kb1.svelte";
  import Kb2 from "./pages/Kb2.svelte";
  import Kb3 from "./pages/Kb3.svelte";
  import Kb4 from "./pages/Kb4.svelte";
  import Profil from "./pages/Profil.svelte";
  import { getAuth, clearAuth, getProgress, markVisited, resetProgress } from "./utils/storage.js";

  const VALID = ["login", "dashboard", "kb1", "kb2", "kb3", "kb4", "profil"];

  const developer = {
    nama: "David Yehuda Surbakti",
    kelas: "XI RPL (Rekayasa Perangkat Lunak)",
    sekolah: "SMK Bagimu Negeriku",
    kota: "Semarang",
  };

  function pageFromHash() {
    const h = (window.location.hash || "").replace("#/", "").replace("#", "").trim();
    return VALID.includes(h) ? h : "dashboard";
  }

  let username = $state(getAuth()?.username ?? "");
  let logged = $state(!!username);
  let page = $state(logged ? pageFromHash() : "login");
  let progress = $state(getProgress());

  function syncHash() {
    const target = logged ? page : "login";
    const want = target === "dashboard" ? "#/dashboard" : `#/${target}`;
    if (window.location.hash !== want) history.replaceState(null, "", want);
    window.scrollTo({ top: 0 });
  }

  $effect(() => {
    syncHash();
  });

  window.addEventListener("hashchange", () => {
    const p = pageFromHash();
    if (!logged) {
      page = "login";
    } else {
      page = p;
    }
  });

  function handleLogin(u) {
    username = u;
    logged = true;
    progress = getProgress();
    page = "dashboard";
    syncHash();
  }

  function handleLogout() {
    clearAuth();
    username = "";
    logged = false;
    page = "login";
    syncHash();
  }

  function nav(p) {
    if (!VALID.includes(p)) return;
    if (!logged) {
      page = "login";
    } else {
      page = p;
    }
    syncHash();
  }

  function handleProgress(kbId) {
    progress = markVisited(kbId);
  }

  function handleReset() {
    if (confirm("Reset semua progres & nilai kuis?")) {
      progress = resetProgress();
    }
  }

  // Guard: jika belum login, paksa ke login
  $effect(() => {
    if (!logged && page !== "login") page = "login";
    if (logged && page === "login") page = "dashboard";
  });
</script>

{#if !logged || page === "login"}
  <Login onLogin={handleLogin} />
{:else}
  <Navbar username={username} current={page} onNav={nav} onLogout={handleLogout} />
  <main style="flex:1">
    {#if page === "dashboard"}
      <Dashboard username={username} progress={progress} onNav={nav} onReset={handleReset} />
    {:else if page === "kb1"}
      <Kb1 onNav={nav} onProgress={handleProgress} />
    {:else if page === "kb2"}
      <Kb2 onNav={nav} onProgress={handleProgress} />
    {:else if page === "kb3"}
      <Kb3 onNav={nav} onProgress={handleProgress} />
    {:else if page === "kb4"}
      <Kb4 onNav={nav} onProgress={handleProgress} />
    {:else if page === "profil"}
      <Profil
        nama={developer.nama}
        kelas={developer.kelas}
        sekolah={developer.sekolah}
        kota={developer.kota}
        inisial="D"
      />
    {/if}
  </main>
  <footer class="footer">
    <div class="container"><span>ƒ MathLearn SMK — buku matematika interaktif</span><span>XI • {developer.sekolah}, {developer.kota}</span></div>
  </footer>
{/if}
