<script lang="ts">
  export let state: "ready" | "waiting" | "recognizing" = "ready";
</script>

<div class="recognizing-indicator">
  {#if state==="waiting"}<span>**Waiting**</span>{/if}
  {#if state==="recognizing"}<span>**Recognizing**</span>{/if}
</div>
