<script lang="ts">
  import type { ExampleScoreMetrics } from "@geoffcox/pretty-good-nlp";
  import * as _ from "lodash";

  export let scoreMetrics: ExampleScoreMetrics;

  $: weightPercent =
    scoreMetrics.matchedNeverParts === 0 && scoreMetrics.partsWeight > 0
      ? scoreMetrics.matchedPartsWeight / scoreMetrics.partsWeight
      : 0;
  $: outOfOrderPercent =
    scoreMetrics.matchedParts > 0
      ? (scoreMetrics.matchedParts - scoreMetrics.inOrderMatchedParts) /
        scoreMetrics.matchedParts
      : 0;
  $: noisePercent =
    scoreMetrics.tokens > 0
      ? (scoreMetrics.tokens - scoreMetrics.matchedTokens) / scoreMetrics.tokens
      : 0;

  $: score = weightPercent - outOfOrderPercent * 0.25 - noisePercent * 0.25;
</script>

<div class="metrics">
  {#if scoreMetrics}
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedParts}/{scoreMetrics.parts}
      </div>
      <div class="metric-description">matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedPartsWeight}/{scoreMetrics.partsWeight}
      </div>
      <div class="metric-description">matched weight</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.inOrderMatchedParts}/{scoreMetrics.matchedParts}
      </div>
      <div class="metric-description">matches in order</div>
    </div>

    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedTokens}/{scoreMetrics.tokens}
      </div>
      <div class="metric-description">token matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedNeverParts}
      </div>
      <div class="metric-description">never matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">weight=</div>
      <div class="metric-description">{weightPercent * 100}%</div>
    </div>
    <div class="metric">
      <div class="metric-value">out of order=</div>
      <div class="metric-description">{outOfOrderPercent * 100}%</div>
    </div>
    <div class="metric">
      <div class="metric-value">noise=</div>
      <div class="metric-description">{noisePercent * 100}%</div>
    </div>
    <div class="metric">
      <div class="metric-value">score=</div>
      <div class="metric-description">
        weight - (out of order * 0.25) - (noise * 0.25) =
      </div>
      <div class="metric-description">{score * 100}%</div>
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
