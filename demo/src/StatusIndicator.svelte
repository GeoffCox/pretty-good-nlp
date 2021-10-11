<script lang="ts">
  export let state: "ready" | "waiting" | "recognizing" = "ready";
</script>

<div class="indicator">
  <div class="line" />
  <div class="status">    
    {#if state === "ready"}<span>ready</span>{/if}
    {#if state === "waiting"}<span>waiting</span>{/if}
    {#if state === "recognizing"}<span>recognizing</span>{/if}
  </div>
  <div class="line" />
</div>

<style>
  .indicator {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto;    
    margin: 5px 10px 20px 5px;
    height: 12px;
  }
  .line {
    border-top: 1px solid #888;
    height: 1px;
  }
  .status {    
    padding: 0 5px;
    font-size: 12px;
    color: #888;
  }
</style>
