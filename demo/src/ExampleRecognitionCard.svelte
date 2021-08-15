<script lang="ts">
    import * as _ from "lodash";
    import type { ExampleRecognition } from "@geoffcox/pretty-good-nlp";
    import RecognitionLabel from "./RecognitionLabel.svelte";
    import ScoreMetricsCard from "./ScoreMetricsCard.svelte";
  
    export let exampleRecognition: ExampleRecognition;
    export let text: string;
  
    $: score = exampleRecognition ? Math.floor(exampleRecognition.score * 100) : 0;    
  </script>
  
  <div>
    {#if exampleRecognition}
      <div class="root">
        <div class="score">
          <div class="score-value">{score}%</div>
        </div>
        <div class="summary">
          <div class="example-name">
            {exampleRecognition.name}
          </div>
          <RecognitionLabel exampleRecognition={exampleRecognition} text={text} />
          <ScoreMetricsCard scoreMetrics={exampleRecognition.scoreMetrics} />
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
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: grid;
      justify-content: center;
      align-content: center;
    }
    .score-value {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 18pt;
      padding: 10px;
    }
    .summary {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      margin-left: 20px;
    }
    .example-name {    
      display: grid;
      justify-content: start;
      align-content: center;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14pt;
    }   
  </style>
  