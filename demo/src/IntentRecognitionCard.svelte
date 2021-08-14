<script lang="ts">
  import * as _ from "lodash";
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";

  export let intentRecognition: IntentRecognition;

  $: score = intentRecognition ? Math.round(intentRecognition.score * 100) : 0;
  $: variables = intentRecognition
    ? _.toPairs(intentRecognition.variableValues)
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
                {variable[1].join("|")}
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
</style>
