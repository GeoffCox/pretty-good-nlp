<script lang="ts">
  import type { ExampleScoreMetrics } from "@geoffcox/pretty-good-nlp";

  export let scoreMetrics: ExampleScoreMetrics;

  $: weightPercent =
    scoreMetrics.matchedNeverPartCount === 0 && scoreMetrics.partWeightSum > 0
      ? scoreMetrics.matchedPartWeightSum / scoreMetrics.partWeightSum
      : 0;
  $: outOfOrderPercent =
    scoreMetrics.matchedPartCount > 0
      ? (scoreMetrics.matchedPartCount - scoreMetrics.inOrderMatchedPartCount) /
        scoreMetrics.matchedPartCount
      : 0;
  $: noisePercent =
    scoreMetrics.tokenCount > 0
      ? (scoreMetrics.tokenCount - scoreMetrics.matchedTokenCount) / scoreMetrics.tokenCount
      : 0;

  $: score = weightPercent - outOfOrderPercent * 0.15 - noisePercent * 0.05;
</script>

<div class="metrics">
  {#if scoreMetrics}
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedPartCount}/{scoreMetrics.partCount}
      </div>
      <div class="metric-description">matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedPartWeightSum}/{scoreMetrics.partWeightSum}
      </div>
      <div class="metric-description">matched weight</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.inOrderMatchedPartCount}/{scoreMetrics.matchedPartCount}
      </div>
      <div class="metric-description">matches in order</div>
    </div>

    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedTokenCount}/{scoreMetrics.tokenCount}
      </div>
      <div class="metric-description">token matches</div>
    </div>
    <div class="metric">
      <div class="metric-value">
        {scoreMetrics.matchedNeverPartCount}
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
        weight - (out of order * 0.15) - (noise * 0.05) =
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
