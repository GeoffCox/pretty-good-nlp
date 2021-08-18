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

  // Pivots matches from per part to per best/worst
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

  // Matches
  $: matches = pivotMatches(exampleRecognition?.parts || []);  
  
  $: matchesCssVars = matches.map((matchSet, s) =>
    matchSet.map((match) => {
      return {
        "--line-left": `${match.start * characterWidth}px`,
        "--line-top": `${s * 5}px`,
        "--line-width": `${match.length * characterWidth}px`,
        "--line-height": "3px",
        "--line-color": s > 0 ? "gray" : "green",
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

  $: matchesLinesStyles = `--lines-height:${matches.length * 5}px;`;

  // Never Matches
  $: neverMatches = pivotMatches(exampleRecognition.neverParts || []);

  $: neverMatchesCssVars = neverMatches.map((neverMatchSet, s) =>
    neverMatchSet.map((neverMatch) => {
      return {
        "--line-left": `${neverMatch.start * characterWidth}px`,
        "--line-top": `${s * 5}px`,
        "--line-width": `${neverMatch.length * characterWidth}px`,
        "--line-height": "3px",        
      };
    })
  );

  $: neverMatchesStyles = neverMatchesCssVars.map((neverMatchSet) =>
    neverMatchSet.map(
      (neverMatch) =>
        Object.entries(neverMatch)
          .map(([key, value]) => `${key}:${value}`)
          .join(";") as string
    )
  ) as string[][];

  $: neverMatchesLinesStyles = `--lines-height:${neverMatches.length * 5}px;`;
</script>

<div class="recognition-label">
  <div class="measure-character" bind:this={measureCharacter}>W</div>
  <div class="utterance">{text}</div>
  <div class="never-lines" style={neverMatchesLinesStyles}>
    {#each neverMatchesStyles as neverMatchSetStyles}
      {#each neverMatchSetStyles as neverMatchStyle}
        <div class="never-line" style={neverMatchStyle} />
      {/each}
    {/each}
  </div>
  <div class="match-lines" style={matchesLinesStyles}>
    {#each matchesStyles as matchSetStyles}
      {#each matchSetStyles as matchStyle}
        <div class="match-line" style={matchStyle} />
      {/each}
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

  .match-lines, .never-lines {
    position: relative;
    margin: 0;
    padding: 0;    
    height: var(--lines-height);
  }

  .match-line, .never-line {
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

  .never-line {
    background: darkred;
  }
</style>
