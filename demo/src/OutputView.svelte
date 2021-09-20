<script lang="ts">
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";

  import debounce from "lodash-es/debounce";
  import { recognize } from "@geoffcox/pretty-good-nlp";
  import IntentRecognitionCard from "./IntentRecognitionCard.svelte";
  import { demoDocument, demoDocumentIndex } from "./stores";
  import type { DemoDocument } from "./types";

  let text = "";

  let textToRecognize = "";
  let intentRecognition: IntentRecognition;

  let pendingRecognize = false;
  let isRecognizing = false;

  const doRecognition = debounce((text: string, document: DemoDocument) => {
    pendingRecognize = false;
    isRecognizing = true;
    textToRecognize = text;
    intentRecognition = recognize(textToRecognize, document.intents[0], {
      shared: $demoDocument?.shared,
    });
    setTimeout(() => {
      isRecognizing = false;
    }, 1000);
  }, 1000);

  $: {
    if (text && $demoDocument) {
      pendingRecognize = true;
      doRecognition(text, $demoDocument);
    }
  }
</script>

<div class="output-view">
  <div class="text-input">
    <input
      type="text"
      bind:value={text}
      placeholder="Type something to recognize"
    />
  </div>
  <div>
    {#if pendingRecognize}<span>**Waiting**</span>{/if}
    {#if isRecognizing}<span>**Recognizing**</span>{/if}
  </div>
  <div class="recognitions">
    <IntentRecognitionCard {intentRecognition} text={textToRecognize} />
  </div>
</div>

<style>
  .output-view {
    display: grid;
    grid-template-rows: auto auto 1fr;
  }

  .text-input {
    margin: 20px auto;
    width: 80%;
  }
  .text-input input {
    width: 450px;
  }
  .recognitions {
    padding: 10px;
  }
</style>
