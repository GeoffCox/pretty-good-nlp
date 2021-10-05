<script lang="ts">
  import type { ExampleRecognition } from "@geoffcox/pretty-good-nlp";
  import RecognitionLabel from "./RecognitionLabel.svelte";
  import ScoreMetricsCard from "./ExampleResultMetrics.svelte";

  export let exampleRecognition: ExampleRecognition;
  export let text: string;

  $: score = exampleRecognition
    ? Math.floor(exampleRecognition.score * 100)
    : 0;
</script>

<!--
  @component
  Displays an ExampleRecognition
-->
<div>
  {#if exampleRecognition}
    <div class="root">
      <div class="header">
        <div class="score">
          <div class="score-value">{score}%</div>
        </div>
        <div class="example-name">
          {exampleRecognition.name}
        </div>
      </div>
      <div class="details">
        <div class="labels">
          <RecognitionLabel {exampleRecognition} {text} />
        </div>
        <div class="metrics">
          <ScoreMetricsCard metrics={exampleRecognition.scoreMetrics} />
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .header {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    align-items: center;
  }

  .score {
    border: 2px solid black;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    justify-content: center;
    align-content: center;
  }

  .score-value {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    padding: 10px;
  }

  .example-name {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14pt;
    margin-left: 10px;
  }

  .details {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    margin-left: 0 0 0 52px;
    padding: 10px 0;
  }

  .metrics {
    margin-top: 5px;
  }
</style>
