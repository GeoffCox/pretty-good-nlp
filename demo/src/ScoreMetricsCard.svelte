<script lang="ts">
  import * as _ from "lodash";
  export let scoreMetrics: Record<string, number>;

  $: metrics = scoreMetrics ? _.toPairs(scoreMetrics) : undefined;
</script>

<div class="score-metrics">
  {#if scoreMetrics}
    {#each metrics as metric}
      <div class="metric-name">
        {metric[0]}:
      </div>
      <div class="metric-value">
        {metric[1]}
      </div>
    {/each}
  {/if}
</div>

<style>
  .score-metrics {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 10pt;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    justify-content: start;
  }
  .metric-name {
    font-weight: bold;
    padding: 2px;
  }
  .metric-value {
      padding: 2px;
  }
</style>
