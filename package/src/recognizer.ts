import { maxBy, uniqBy } from "lodash";
import { TokenMap } from "./tokenMap";
import {
  Example,
  ExampleRecognition,
  ExamplePart,
  ExamplePartRecognition,
  Intent,
  MatchSortFactory,
  IntentRecognition,
  Tokenizer,
  ExampleScoreMetrics,
} from "./types";
import { tokenize as basicTokenize } from "./basicTokenizer";
import { createBasicMatchSort } from "./basicMatchSort";
import { findPatterns } from "./findPatterns";
import { findPhrases } from "./findPhrases";
import { findRegularExpressions } from "./findRegularExpressions";
import * as CharacterRanges from "./characterRange";

type CharacterRange = CharacterRanges.CharacterRange;

const findPartMatches = (
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
      ...findRegularExpressions(part.regularExpressions, textTokenMap.text)
    );
  }

  return {
    matches: uniqBy(result, (value) => `${value.start}..${value.end}`),
    weight: part.weight,
    variable: part.variable,
  };
};

const scoreExample = (
  example: Pick<ExampleRecognition, "parts" | "neverParts">,
  textTokenMap: TokenMap
): {score: number, metrics: ExampleScoreMetrics} => {
  const { parts, neverParts } = example;
  
  let matchCount = 0;
  let partWeightSum = 0.0;
  let matchWeightSum = 0.0;
  let inOrderCount = 0;
  let lastEnd = -1;
  const bestMatches: CharacterRange[] = [];
  parts.forEach((part) => {
    const weight = part.weight !== undefined ? part.weight : 1;
    partWeightSum += weight; 
    if (part.matches.length > 0) {
      matchCount++;
      matchWeightSum += weight;
      if (lastEnd == -1 || part.matches[0].start >= lastEnd) {
        inOrderCount++;
      }
      lastEnd = part.matches[0].end;
      bestMatches.push(part.matches[0]);
    }
  });

  // count tokens that aren't the best match
  let nonMatchCount = textTokenMap.characterRanges.filter(
    (characterRange) =>
      !bestMatches.some((m) => CharacterRanges.contains(m, characterRange))
  ).length;

  // count never matches
  let neverMatchCount = neverParts.filter(
    (neverPart) => neverPart.matches.length > 0
  ).length;

  // possible = sum of part weights + 1/2 point for every match in order  
  const possibleScore = Math.max(0, partWeightSum + 0.5 * matchCount);

  // actual = sum of match weights + 1/2 point for each match in order - 1/4 point for each token not matched
  const actualScore =
    neverMatchCount === 0
      ? Math.max(0, matchWeightSum + 0.5 * inOrderCount - 0.25 * nonMatchCount)
      : 0;

  const score = possibleScore > 0 ? Math.min(1, Math.max(0, actualScore / possibleScore)) : 0;      

  return {
    score,
    metrics: {
      parts: parts.length,
      matches: matchCount,
      inOrder: inOrderCount,
      unmatched: nonMatchCount,
      neverMatches: neverMatchCount,
      partWeightSum,
      matchWeightSum,
      possibleScore,
      actualScore
    },
  };
};

const extractVariableValues = (
  text: string,
  example: Pick<ExampleRecognition, "parts">
): Record<string, string[]> => {
  const variableValues: Record<string, string[]> = {};

  example.parts.forEach((part) => {
    if (part.variable && part.matches.length > 0) {
      const variableName = part.variable;
      part.matches.forEach((match) => {
        const value = text.substring(match.start, match.end);
        const values = variableValues[variableName];
        if (!values) {
          variableValues[variableName] = [value];
        } else {
          values.push(value);
        }
      });
    }
  });

  return variableValues;
};

const recognizeExample = (
  example: Example,
  textTokenMap: TokenMap,
  tokenizer: Tokenizer,
  createMatchSort?: MatchSortFactory
): ExampleRecognition => {
  const { canonicalForm, parts, neverParts } = example;
  const matchSort = createMatchSort
    ? createMatchSort()
    : createBasicMatchSort();

  const partResults =
    parts?.map((part) => {
      const partResult = findPartMatches(part, textTokenMap, tokenizer);
      matchSort(partResult.matches);
      return partResult;
    }) || [];

  const neverPartResults =
    neverParts?.map((part) => {
      const partResult = findPartMatches(part, textTokenMap, tokenizer);
      matchSort(partResult.matches);
      return partResult;
    }) || [];

  const { score, metrics } = scoreExample(
    { parts: partResults, neverParts: neverPartResults },
    textTokenMap
  );

  return {
    name: canonicalForm,
    parts: partResults,
    neverParts: neverPartResults,
    score,
    scoreMetrics: metrics,
  };
};

export const recognize = (
  text: string,
  intent: Intent,
  tokenizer?: Tokenizer
): IntentRecognition => {
  const tokenize = tokenizer ?? basicTokenize;

  const textTokenMap = tokenize(text);
  const exampleRecognitions = intent.examples.map((example) =>
    recognizeExample(example, textTokenMap, tokenize)
  );

  const best = maxBy(exampleRecognitions, "score");

  return {
    name: intent.name,
    score: best ? best.score : 0,
    details: {
      bestExample: best,
      examples: exampleRecognitions,
      textTokenMap,
    },
    variableValues: best ? extractVariableValues(text, best) : {},
  };
};

/**
 * @internal
 */
export namespace UnitTestApi {
  export const recognizerModule = {
    findPartMatches,
    scoreExample,
    extractVariableValues,
    recognizeExample,    
  };
}
