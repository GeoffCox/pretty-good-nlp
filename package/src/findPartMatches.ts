import uniqBy from "lodash/uniqBy";
import type { CharacterRange } from "./characterRange";
import { findPatterns } from "./findPatterns";
import { findPhrases } from "./findPhrases";
import { _findRegularExpressions } from "./findRegularExpressions";
import type { TokenMap } from "./tokenMap";
import type {
  ExamplePart,
  ExamplePartRecognition,
  Tokenizer,
} from "./types";

/**
 * @internal
 */
 export const findPartMatches = (
    part: ExamplePart,
    textTokenMap: TokenMap,
    tokenizer: Tokenizer
  ): ExamplePartRecognition => {
    const result: CharacterRange[] = [];
  
    if (part.phrases) {
      result.push(...findPhrases(part.phrases, textTokenMap, tokenizer));
    }
    if (part.patterns) {
      result.push(...findPatterns(part.patterns, textTokenMap.text));
    }
    if (part.regularExpressions) {
      result.push(
        ..._findRegularExpressions(part.regularExpressions, textTokenMap.text)
      );
    }    
  
    return {
      name: part.name,
      matches: uniqBy(result, (value) => `${value.start}..${value.end}`),
      ignoreOrder: part.ignoreOrder,
      required: part.required,      
      weight: part.weight,
      variable: part.variable,
    };
  };