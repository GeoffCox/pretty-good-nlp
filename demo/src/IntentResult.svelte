<script lang="ts">
  import toPairs from "lodash/toPairs";
  import orderBy from "lodash/orderBy";
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";
  import ExampleRecognitionCard from "./ExampleResult.svelte";

  export let intentRecognition: IntentRecognition;
  export let text: string;

  $: score = intentRecognition ? Math.floor(intentRecognition.score * 100) : 0;
  $: variables = intentRecognition
    ? toPairs(intentRecognition.variableValues)
    : undefined;

  const toggleShowAllExamples = () => {
    showAllExamples = !showAllExamples;
  };

  let showAllExamples = false;

  $: exampleRecognitions = intentRecognition?.details?.examples
    ? orderBy(intentRecognition?.details?.examples, ["score"], ["desc"])
    : [];

  $: bestExample = exampleRecognitions?.[0];
</script>

<!--
  @component
  Displays an IntentRecognition and its ExampleRecognitions
-->
<div>
  {#if intentRecognition}
    <div class="intent-result">
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
        <div class="examples-area">
          <div class="examples">
            {#if showAllExamples}
              {#each exampleRecognitions as exampleRecognition}
                <div class="example">
                  <ExampleRecognitionCard {exampleRecognition} {text} />
                </div>
              {/each}
            {:else}
              <div class="example">
                <ExampleRecognitionCard
                  exampleRecognition={bestExample}
                  {text}
                />
              </div>
            {/if}
          </div>
          {#if exampleRecognitions.length > 1}
            <button
              class="toggle-examples-button"
              on:click={toggleShowAllExamples}
              >{showAllExamples
                ? "Hide Other Example Recognitions"
                : "Show All Example Recognitions"}</button
            >
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .intent-result {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
  }

  .score {
    border: 2px solid black;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: grid;
    justify-content: center;
    align-content: center;
  }

  .score-value {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 24px;
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
    font-size: 14px;
    margin-left: 20px;
    align-items: center;
    row-gap: 5px;
  }

  .variable-name {
    font-weight: bold;
    justify-self: end;
  }

  .variable-value {
    margin-left: 0.5em;
  }

  .variable-name::after {
    content: ":";
  }

  .toggle-examples-button {
    margin: 5px 0 5px 20px;
    min-width: 220px;
    font-size: 14px;
  }

  .example {
    margin: 10px 10px 10px 20px;
    padding: 10px;
  }
</style>
