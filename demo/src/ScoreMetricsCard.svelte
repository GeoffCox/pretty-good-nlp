<script lang="ts">
  import type { ExampleScoreMetrics } from "@geoffcox/pretty-good-nlp";

  import * as _ from "lodash";
  export let scoreMetrics: ExampleScoreMetrics;
</script>

<div class="metrics">
  {#if scoreMetrics}
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matches}/{scoreMetrics.parts}
      </div>
      <div class="metric-description">matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.inOrder}/{scoreMetrics.matches}
      </div>
      <div class="metric-description">matches in order</div>
    </div>

    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.unmatched}
      </div>
      <div class="metric-description">unmatched</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.neverMatches}
      </div>
      <div class="metric-description">never matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchWeightSum}/{scoreMetrics.partWeightSum}
      </div>
      <div class="metric-description">matched weight</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.actualScore}/{scoreMetrics.possibleScore}
      </div>
      <div class="metric-description">score</div>
    </div>
  {/if}
</div>

<style>
  .metrics {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 10pt;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    justify-content: start;
    border-left: 1px solid #efefef;
    padding: 2px;
    margin-left: 15px;    
  }
  .metric {
    padding: 2px;
  }
  .metric-value {
    display: inline;
    font-weight: bold;
  }
  .metric-description {
    display: inline;
  }
</style>
