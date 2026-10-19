<script>
  let { percent = 0, label = "" } = $props();
</script>

<div>
  <div class="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
    <div class="progress-fill" style="width: {percent}%"></div>
  </div>
  <div class="progress-row">
    <span>{label || `Progres belajar: ${percent}%`}</span>
    <span>{percent}%</span>
  </div>
</div>
