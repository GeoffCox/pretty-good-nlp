<script lang="ts">
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";

  import debounce from "lodash-es/debounce";
  import { recognize } from "@geoffcox/pretty-good-nlp";
  import IntentRecognitionResult from "./IntentResult.svelte";
  import { demoDocument, demoDocumentIndex } from "./stores";
  import type { DemoDocument } from "./types";
  import InputView from "./InputView.svelte";
  import RecognizingIndicator from "./StatusIndicator.svelte";
  import { onMount } from "svelte";
  import Instructions from "./Instructions.svelte";

  let text = "";

  let textToRecognize = "";
  let results: IntentRecognition[] = [];

  let state: "ready" | "waiting" | "recognizing" = "ready";

  const doRecognition = debounce((text: string, document: DemoDocument) => {
    state = "recognizing";
    textToRecognize = text;
    results = document.intents.map((intent) =>
      recognize(textToRecognize, intent, { shared: document.shared })
    );
    setTimeout(() => {
      state = "ready";
    }, 1000);
  }, 1000);

  const onTextChange = (text) => {
    text = text;
  };
  $: {
    if ($demoDocument && text && text.length > 0) {
      state = "waiting";
      doRecognition(text, $demoDocument);
    } else {
      state = "ready";
      textToRecognize = "";
      results = [];
    }
  }
</script>

<div class="output-view">
  <div class="input-view">
    <InputView bind:text on:change={onTextChange} />
  </div>
  <RecognizingIndicator {state} />
  {#if results.length > 0}
    <div class="recognitions">
      {#each results as result}
        <IntentRecognitionResult
          intentRecognition={result}
          text={textToRecognize}
        />
      {/each}
    </div>
  {:else}
    <div class="recognitions">
      <Instructions />
    </div>
  {/if}
</div>

<style>
  .output-view {
    display: grid;
    grid-template-rows: auto auto 1fr;
    grid-template-columns: 1fr;
    height: 100%;
    width: 100%;
  }
  .input-view {
    padding: 20px 40px 5px 20px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    align-items: stretch;
    height: 100%;
    width: 100%;
  }
  .recognitions {
    padding: 10px;
    overflow: auto;
    height: 100%;
    width: 100%;
    min-width: 0;
  }
</style>
