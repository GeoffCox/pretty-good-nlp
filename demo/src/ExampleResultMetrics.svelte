<script lang="ts">
  import type { ExampleScoreMetrics } from "@geoffcox/pretty-good-nlp";

  export let metrics: ExampleScoreMetrics;

  const toPercentText = (value: number) => {
    return `${Math.floor(value * 100)}%`;
  };

  // ----- Weighted Matches ----- //
  $: weightPercent =
    metrics.matchedNeverPartCount === 0 && metrics.partWeightSum > 0
      ? metrics.matchedPartWeightSum / metrics.partWeightSum
      : 0;

  $: weightTooltip =
    metrics.matchedNeverPartCount === 0
      ? `${metrics.matchedPartCount}/${metrics.partCount} matches, ${metrics.matchedPartWeightSum}/${metrics.partWeightSum} weighted sum`
      : `${metrics.matchedNeverPartCount} never matches`;

  // ----- Out of Order ----- //
  $: outOfOrderCount =
    metrics.matchedPartCount > 0
      ? metrics.matchedPartCount - metrics.inOrderMatchedPartCount
      : 0;

  $: outOfOrderPercent =
    metrics.matchedPartCount > 0
      ? outOfOrderCount / metrics.matchedPartCount
      : 0;

  $: outOfOrderPenaltyPercent = outOfOrderPercent * 0.15;

  $: outOfOrderTooltip = `${outOfOrderCount}/${
    metrics.matchedPartCount
  } tokens out of order  = ${toPercentText(
    outOfOrderPercent
  )} x 15% penalty weight = ${toPercentText(outOfOrderPenaltyPercent)}`;

  // ----- Noise ----- //
  $: noiseCount =
    metrics.tokenCount > 0
      ? metrics.tokenCount - metrics.matchedTokenCount
      : 0;
  $: noisePercent =
    metrics.tokenCount > 0 ? noiseCount / metrics.tokenCount : 0;

  $: noisePenaltyPercent = noisePercent * 0.05;

  $: noiseTooltip = `${noiseCount}/${
    metrics.tokenCount
  } noise tokens =  ${toPercentText(
    noisePercent
  )} x 5% penalty weight = ${toPercentText(noisePenaltyPercent)}`;

  // ----- Score ----- //
  $: score = weightPercent - outOfOrderPenaltyPercent - noisePenaltyPercent;
</script>

<!--
  @component
  Metrics for how an example recognition score was calculated.
-->
<div class="metrics">
  {#if metrics}
    <div class="matches" title={weightTooltip}>
      {toPercentText(weightPercent)} matched
    </div>
    <div class="math-operator">-</div>
    <div class="out-of-order" title={outOfOrderTooltip}>
      {toPercentText(outOfOrderPenaltyPercent)} out of order
    </div>
    <div class="math-operator">-</div>
    <div class="noise" title={noiseTooltip}>
      {toPercentText(noisePenaltyPercent)} noise
    </div>
    <div class="math-operator">=</div>
    <div class="score">
      {toPercentText(score)}
    </div>
  {/if}
</div>

<style>
  .metrics {    
    color: #444;
    display: flex; 
    flex-wrap: wrap;       
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;    
    font-size: 14px;
  }
  .math-operator {
    padding: 0 0.5em;
  }
</style>
