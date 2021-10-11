<script lang="ts">
  import type {    
    ExampleRecognition,
  } from "@geoffcox/pretty-good-nlp";

  import { getLabelLines } from "./labels";

  export let text: string;
  export let exampleRecognition: ExampleRecognition;

  // Single character width measurement
  let measureCharacter;
  $: measureBoundingRect =
    measureCharacter && measureCharacter.getBoundingClientRect();
  $: characterWidth = measureBoundingRect?.width || 0.0;

  $: lines = getLabelLines(exampleRecognition, characterWidth, 3, 2);

  $: linesStyles = `--lines-height:${lines.lineCount * 5}px;`;
</script>

<!--
  @component
  Displays a label (underline) for each match in an example recognition
-->
<div class="match-label">
  <div class="measure-character" bind:this={measureCharacter}>W</div>
  <div class="utterance">{text}</div>
  <div class="lines" style={linesStyles}>
    {#each lines.segments as segment}
      <div class="line" style={segment} />
    {/each}
  </div>
</div>

<style>
  .match-label {
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
