<script>
  let { username = "", onNav = () => {}, onLogout = () => {}, current = "" } = $props();
  let open = $state(false);

  function go(page) {
    open = false;
    onNav(page);
  }
</script>

<header class="navbar">
  <div class="navbar-inner">
    <button class="brand" onclick={() => go("dashboard")} aria-label="Ke dashboard">
      <span class="brand-mark">ƒ</span>
      <span>MathLearn<small>SMK • KELAS XI</small></span>
    </button>
    <button class="menu-toggle" aria-label="Buka menu" aria-expanded={open} onclick={() => (open = !open)}>
      {open ? "✕" : "☰"}
    </button>
    {#if current !== "login"}
      <nav class="nav-links" class:open aria-label="Navigasi utama">
        <span class="nav-user">{username}</span>
        <button class="nav-link" class:active={current === "dashboard"} onclick={() => go("dashboard")}>Belajar</button>
        <button class="nav-link" class:active={current === "profil"} onclick={() => go("profil")}>Profil</button>
        <button class="nav-link" onclick={onLogout}>Keluar →</button>
      </nav>
    {/if}
  </div>
</header>
