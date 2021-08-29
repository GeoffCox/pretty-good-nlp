import { findPartMatches } from "./findPartMatches";
import { _findRegularExpressions } from "./findRegularExpressions";
import { createMatchSort } from "./matchSort";
import { scoreExample } from "./scoreExample";
import type { TokenMap } from "./tokenMap";
import type {
  Example,
  ExampleRecognition,
  Tokenizer,
} from "./types";

/**
 * @internal
 */
 export const recognizeExample = (
    example: Example,
    textTokenMap: TokenMap,
    tokenizer: Tokenizer,
    maxOutOfOrderPenalty: number,
    maxNoisePenalty: number
  ): ExampleRecognition => {
    const { name, parts, neverParts } = example;
  
    // I need to create a new match sort for each example because it is stateful.
    const matchSort = createMatchSort();
  
    const partResults = parts.map((part) => {
      const partResult = findPartMatches(part, textTokenMap, tokenizer);
      matchSort(partResult.matches);
      return partResult;
    });
  
    const neverPartResults =
      neverParts?.map((part) => {
        const partResult = findPartMatches(part, textTokenMap, tokenizer);
        matchSort(partResult.matches);
        return partResult;
      }) || [];
  
    const { score, metrics } = scoreExample(
      { parts: partResults, neverParts: neverPartResults },
      textTokenMap,
      maxOutOfOrderPenalty,
      maxNoisePenalty
    );
  
    return {
      name,
      parts: partResults,
      neverParts: neverPartResults,
      score,
      scoreMetrics: metrics,
    };
  };