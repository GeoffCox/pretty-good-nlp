<script lang="ts">
  import type {
    CharacterRange,
    ExamplePartRecognition,
    ExampleRecognition,
  } from "@geoffcox/pretty-good-nlp";

  import * as _ from "lodash";
  import { getLines } from "./labels";

  export let text: string;
  export let exampleRecognition: ExampleRecognition;

  // Single character width measurement
  let measureCharacter;
  $: measureBoundingRect =
    measureCharacter && measureCharacter.getBoundingClientRect();
  $: characterWidth = measureBoundingRect?.width || 0.0;

  $: lines = getLines(exampleRecognition, characterWidth, 3, 2);

  $: linesStyles = `--lines-height:${lines.lineCount * 5}px;`;
</script>

<div class="recognition-label">
  <div class="measure-character" bind:this={measureCharacter}>W</div>
  <div class="utterance">{text}</div>
  <div class="lines" style={linesStyles}>
    {#each lines.segments as segment}
      <div class="line" style={segment} />
    {/each}
  </div>
</div>

<style>
  .recognition-label {
    font-family: monospace;
    font-size: 12pt;
  }

  .measure-character {
    position: absolute;
    width: fit-content;
    height: fit-content;
    left: -10000px;
    margin: 0;
    padding: 0;
  }

  .utterance {
    margin: 0;
    padding: 0;
    white-space: nowrap;
  }

  .lines {
    position: relative;
    margin: 0;
    padding: 0;
    height: var(--lines-height);
  }

  .line {
    position: absolute;
    left: var(--line-left);
    right: 0;
    top: var(--line-top);
    bottom: 0;
    width: var(--line-width);
    height: var(--line-height);
    background: var(--line-color);
    margin: 0;
    padding: 0;
  }
</style>
