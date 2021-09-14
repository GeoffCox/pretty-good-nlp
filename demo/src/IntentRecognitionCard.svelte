<script lang="ts">
  import toPairs from "lodash-es/toPairs";
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";
  import ExampleRecognitionCard from "./ExampleRecognitionCard.svelte";

  export let intentRecognition: IntentRecognition;
  export let text: string;

  $: score = intentRecognition ? Math.floor(intentRecognition.score * 100) : 0;
  $: variables = intentRecognition
    ? toPairs(intentRecognition.variableValues)
    : undefined;
</script>

<div>
  {#if intentRecognition}
    <div class="root">
      <div class="score">
        <div class="score-value">{score}%</div>
      </div>
      <div class="summary">
        <div class="intent-name">
          {intentRecognition.name}
        </div>
        <div class="variables">
          {#each variables as variable}
            <div class="variable-name">
              {variable[0]}
            </div>
            <div class="variable-value">
              {variable[1].join(" | ")}
            </div>
          {/each}
        </div>
        <div class="examples">
          {#each intentRecognition.details.examples as exampleRecognition}
            <div class="example">
              <ExampleRecognitionCard {exampleRecognition} {text} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
  }
  .score {
    border: 3px solid black;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    display: grid;
    justify-content: center;
    align-content: center;
  }
  .score-value {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 42pt;
    padding: 10px;
  }
  .summary {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    margin-left: 20px;
  }
  .intent-name {
    display: grid;
    justify-content: start;
    align-content: center;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 24pt;
  }
  .variables {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    font-family: "Courier New", Courier, monospace;
    font-size: 14pt;
    margin-left: 20px;
  }
  .variable-name {
    font-weight: bold;
  }
  .variable-value::before {
    content: ":";
  }
  .example {
    margin: 10px 10px 10px 20px;
    padding: 10px;
  }
</style>
