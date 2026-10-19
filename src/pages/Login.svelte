<script>
  import { setAuth } from "../utils/storage.js";

  let { onLogin = () => {} } = $props();

  let username = $state("");
  let password = $state("");
  let error = $state("");
  let showPw = $state(false);

  function login() {
    error = "";
    const u = username.trim();
    if (!u || !password) {
      error = "Username dan password wajib diisi.";
      return;
    }
    if (u.length < 3) {
      error = "Username minimal 3 karakter.";
      return;
    }
    if (password.length < 3) {
      error = "Password minimal 3 karakter.";
      return;
    }
    if (u.toLowerCase() === "siswa" && password !== "belajar123") {
      error = "Username atau password tidak sesuai. (Demo: siswa / belajar123)";
      return;
    }
    setAuth({ username: u, loginAt: new Date().toISOString() });
    onLogin(u);
  }

  function keydown(e) {
    if (e.key === "Enter") login();
  }
</script>

<div class="login-wrap">
  <div class="login-card">
    <div class="login-wordmark">
      <span class="fn">ƒ</span>
      <p class="kicker" style="margin-top:10px"><span class="rule"></span>Matematika XI • SMK</p>
      <h1>Fungsi tidak harus<br />cuma dihitung.</h1>
      <p class="sub">Coba, lihat, dan pahami — lewat grafik, perhitungan, contoh soal, dan latihan.</p>
    </div>

    <label class="label" for="username">Username</label>
    <input id="username" class="input" bind:value={username} onkeydown={keydown} placeholder="cth: siswa" autocomplete="username" />

    <label class="label" for="password">Password</label>
    <div style="display:flex;gap:8px">
      <input
        id="password"
        class="input"
        type={showPw ? "text" : "password"}
        bind:value={password}
        onkeydown={keydown}
        placeholder="••••••"
        autocomplete="current-password"
        style="flex:1"
      />
      <button class="btn btn-secondary btn-small" style="white-space:nowrap" onclick={() => (showPw = !showPw)}>
        {showPw ? "Sembunyi" : "Lihat"}
      </button>
    </div>

    {#if error}
      <div class="alert alert-error">{error}</div>
    {/if}

    <div style="margin-top:16px">
      <button class="btn btn-primary btn-block" onclick={login}>Masuk →</button>
    </div>

    <div class="demo-box">
      <b>Akun demo:</b> username <code>siswa</code> password <code>belajar123</code><br />
      Username lain juga bisa dipakai (min. 3 karakter). Data hanya tersimpan di browser (localStorage).
    </div>
  </div>
</div>
