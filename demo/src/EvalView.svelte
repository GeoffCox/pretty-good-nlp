<script lang="ts">
  import type { DemoDocument } from "./types";
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";

  import debounce from "lodash-es/debounce";
  import { recognize } from "@geoffcox/pretty-good-nlp";
  import { demoDocument } from "./stores";

  import InputView from "./InputView.svelte";
  import Instructions from "./Instructions.svelte";
  import IntentResult from "./IntentResult.svelte";
  import StatusIndicator from "./StatusIndicator.svelte";

  let text = "";

  let textToRecognize = "";
  let results: IntentRecognition[] = [];

  let status: "ready" | "waiting" | "recognizing" = "ready";

  const doRecognition = debounce((text: string, document: DemoDocument) => {
    status = "recognizing";
    textToRecognize = text;
    results = document.intents.map((intent) =>
      recognize(textToRecognize, intent, { shared: document.shared })
    );
    setTimeout(() => {
      status = "ready";
    }, 1000);
  }, 1000);

  const onTextChange = (text) => {
    text = text;
  };
  $: {
    if ($demoDocument && text && text.length > 0) {
      status = "waiting";
      doRecognition(text, $demoDocument);
    } else {
      status = "ready";
      textToRecognize = "";
      results = [];
    }
  }
</script>

<!--
  @component
  Displays the results for a recognize call.
-->
<div class="eval-view">
  <div class="input-view">
    <InputView bind:text on:change={onTextChange} />
  </div>
  <StatusIndicator status={status} />
  {#if results.length > 0}
    <div class="recognitions">
      {#each results as result}
        <IntentResult
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
  .eval-view {
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
