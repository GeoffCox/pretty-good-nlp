<script lang="ts">
  import { coffeeIntent, coffeeYaml } from "./intents/coffeeIntent";
  import { recognize } from "@geoffcox/pretty-good-nlp";
  import type { IntentRecognition } from "@geoffcox/pretty-good-nlp";
  import { Split } from "@geoffcox/svelte-splitter";
  import IntentRecognitionCard from "./IntentRecognitionCard.svelte";
  import UtteranceInput from "./UtteranceInput.svelte";
  import RecognitionLabel from "./RecognitionLabel.svelte";
  import YamlEditor from "./YamlEditor.svelte";
  import Tabs from "./Tabs.svelte";
  import { vacationIntent, vacationShared } from "./intents/vacationIntent";

  const intents = [
    { name: "Barrista", intents: [coffeeIntent] },
    {
      name: "Out of Office",
      intents: [vacationIntent],
      shared: vacationShared,
    },
    {
      name: "Custom",
      intents: [
        {
          name: "Name your intent",
          examples: [],
        },
      ],
    },
  ];

  // ---------- Tabs ---------- //

  let tabIndex: number = 0;
  $: tabNames = intents.map((x) => x.name);

  const onTabChanged = (index: number) => {
    tabIndex = index;
  };

  $: intent = intents[tabIndex].intents[0];
  $: {
    console.log(tabIndex);
  }

  let utteranceText = "";
  let recognizedText = "";
  let intentRecognition: IntentRecognition;

  const recognizeInput = (text: string) => {
    recognizedText = text;
    intentRecognition = recognize(text, intent);
  };
</script>

<div class="root">
  <div class="app">
    <div class="header">@geoffcox/pretty-good-nlp demo</div>
    <div class="content">
      <div class="tab-strip">
        <Tabs
          tabs={tabNames}
          initialIndex={tabIndex}
          on:changed={(event) => onTabChanged(event.detail.index)}
        />
      </div>
      <Split resetOnDoubleClick>
        <svelte:fragment slot="primary">
          <YamlEditor {intent} />
        </svelte:fragment>
        <svelte:fragment slot="secondary">
          <UtteranceInput
            bind:text={utteranceText}
            on:recognize={(event) => recognizeInput(event.detail.text)}
          />
          <IntentRecognitionCard {intentRecognition} text={recognizedText} />
        </svelte:fragment>
      </Split>
    </div>
    <div class="footer" />
  </div>
</div>

<style>
  /* Absolute positioning provides an SPA layout */
  .root {
    box-sizing: border-box;
    /* position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden; */
    padding: 0;
    margin: 0;
  }

  .app {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    grid-template-areas: "header" "content" "footer";
  }

  .header {
    box-sizing: border-box;
    font-size: 14pt;
    width: 100%;
    outline: none;
    overflow: hidden;
    grid-area: header;
    padding: 10px;
    background: #222;
    color: #ddd;
  }

  .tabStrip {
    width: 100%;
  }

  .content {
    box-sizing: border-box;
    width: 100%;
    outline: none;
    overflow: hidden;
    grid-area: content;
  }

  .footer {
    box-sizing: border-box;
    width: 100%;
    outline: none;
    overflow: hidden;
    grid-area: footer;
    background: #222;
    color: #ddd;
  }
</style>
