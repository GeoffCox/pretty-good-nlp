<script lang="ts">
  import type {
    ExamplePartRecognition,
    ExampleRecognition,
  } from "@geoffcox/pretty-good-nlp";

  export let text: string;
  export let exampleRecognition: ExampleRecognition;

  // Single character width measurement
  let measureCharacter;
  $: measureBoundingRect =
    measureCharacter && measureCharacter.getBoundingClientRect();
  $: characterWidth = measureBoundingRect?.width || 0.0;

  // Matches grouped into lines by best matches first
  const pivotMatches = (parts: ExamplePartRecognition[]) => {
    const result = [];
    parts.forEach((part) => {
      part.matches.forEach((match, m) => {
        if (!result[m]) {
          result[m] = [];
        }
        result[m].push(match);
      });
    });
    return result;
  };

  $: matches = pivotMatches(exampleRecognition?.parts || []);

  $: matchesCssVars = matches.map((matchSet, s) =>
    matchSet.map((match) => {
      return {
        "--line-left": `${match.start * characterWidth}px`,
        "--line-top": `${s * 5}px`,
        "--line-width": `${match.length * characterWidth}px`,
        "--line-height": '5px',
        "--line-color": s > 0 ? 'gray' : 'green',
      };
    })
  );

  $: matchesStyles = matchesCssVars.map((matchSet) =>
    matchSet.map(
      (match) =>
        Object.entries(match)
          .map(([key, value]) => `${key}:${value}`)
          .join(";") as string
    )
  ) as string[][];

  $: console.log(matchesStyles);
</script>

<div class="recognition-label">
  <div class="measure-character" bind:this={measureCharacter}>W</div>
  <div>{exampleRecognition?.name}</div>
  <div class="utterance">{text}</div>

  {#each matchesStyles as matchSetStyles}
      <div class="lines">
        {#each matchSetStyles as matchStyle}          
          <div class="line" style={matchStyle} />
        {/each}
      </div>
  {/each}
</div>

<style>
  .recognition-label {
    font-family: monospace;
    font-size: 12pt;
  }

  .measure-character {
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
  }

  .utterance {
    margin: 0;
    padding: 0;
  }

  .lines {
    position: relative;
    margin: 0;
    padding: 0;    
    background-color: aliceblue;
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
