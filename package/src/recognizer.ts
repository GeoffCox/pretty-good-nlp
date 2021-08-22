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
import { CharacterRange, CharacterRanges } from "./characterRange";

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
): { score: number; metrics: ExampleScoreMetrics } => {
  const { parts, neverParts } = example;

  // count matches, sum the weights of parts and matches, count the in order matches
  let matchedPartCount = 0;
  let partWeightSum = 0.0;
  let matchedPartWeightSum = 0.0;
  let inOrderMatchedPartCount = 0;
  let lastEnd = -1;
  const bestMatches: CharacterRange[] = [];
  parts.forEach((part) => {
    const weight = part.weight !== undefined ? part.weight : 1;
    partWeightSum += weight;
    if (part.matches.length > 0) {
      matchedPartCount++;
      matchedPartWeightSum += weight;
      if (lastEnd == -1 || part.matches[0].start >= lastEnd) {
        inOrderMatchedPartCount++;
      }
      lastEnd = part.matches[0].end;
      bestMatches.push(part.matches[0]);
    }
  });

  // count never matches
  let matchedNeverPartCount = neverParts.filter(
    (neverPart) => neverPart.matches.length > 0
  ).length;

  // count how many tokens matched
  const tokenCount = textTokenMap.characterRanges.length;
  const matchedTokenCount = textTokenMap.characterRanges.filter(
    (characterRange) =>
      bestMatches.some((m) => CharacterRanges.contains(m, characterRange))
  ).length;

  let score =
    matchedNeverPartCount === 0 && partWeightSum > 0
      ? matchedPartWeightSum / partWeightSum
      : 0;
  const outOfOrderPercent =
    matchedPartCount > 0
      ? (matchedPartCount - inOrderMatchedPartCount) / matchedPartCount
      : 0;
  const noisePercent =
    tokenCount > 0
      ? (textTokenMap.characterRanges.length - matchedTokenCount) / tokenCount
      : 0;
  score -= outOfOrderPercent * 0.15;
  score -= noisePercent * 0.05;
  score = Math.max(0, Math.min(1, score));

  return {
    score,
    metrics: {
      partCount: parts.length,
      matchedPartCount,
      inOrderMatchedPartCount,
      matchedNeverPartCount,
      partWeightSum,
      matchedPartWeightSum,
      tokenCount,
      matchedTokenCount,
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
