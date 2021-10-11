<script lang="ts">
  import type { RecognizerStatus } from "./types";

  import Circle from "svelte-bootstrap-icons/lib/Circle";
  import Clock from "svelte-bootstrap-icons/lib/Clock";
  import Cpu from "svelte-bootstrap-icons/lib/Cpu";

  export let status: RecognizerStatus = "ready";

  const iconSize = 24;  
    
</script>

<!--
  @component
  Provides a horizontal rule with a status icon
-->
<div class="indicator">
  <div class="line" />
  <div class="status">
    {#if status === "ready"}<Circle width={iconSize} height={iconSize} />{/if}
    {#if status === "waiting"}<Clock width={iconSize} height={iconSize} />{/if}
    {#if status === "recognizing"}<Cpu
        width={iconSize}
        height={iconSize}
      />{/if}
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
  }
  .line {
    border: 1px solid transparent;
    border-top: 1px solid #888;
  }
  .status {
    padding: 0 5px;
    color: #888;
  }
</style>
