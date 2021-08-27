import maxBy from "lodash/maxBy";
import uniqBy from "lodash/uniqBy";
import { TokenMap } from "./tokenMap";
import {
  Example,
  ExampleRecognition,
  ExamplePart,
  ExamplePartRecognition,
  Intent,
  IntentRecognition,
  Tokenizer,
  ExampleScoreMetrics,
} from "./types";
import { tokenize as basicTokenize } from "./basicTokenizer";
import { createMatchSort } from "./matchSort";
import { findPatterns } from "./findPatterns";
import { findPhrases } from "./findPhrases";
import { findRegularExpressions } from "./findRegularExpressions";
import { CharacterRange, CharacterRanges } from "./characterRange";
import { resolveIntentReferences } from "./referenceResolver";

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
  textTokenMap: TokenMap,
  maxOutOfOrderPenalty: number,
  maxNoisePenalty: number
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
  score -= outOfOrderPercent * maxOutOfOrderPenalty;
  score -= noisePercent * maxNoisePenalty;
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
  maxOutOfOrderPenalty: number,
  maxNoisePenalty: number
): ExampleRecognition => {
  const { name, parts, neverParts } = example;

  // I need to create a new match sort for each example because it is stateful.
  const matchSort = createMatchSort();

  const partResults =
    parts.map((part) => {
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

/**
 * Options for recognize()
 */
export type RecognizeOptions = {
  /**
   * A set of expressions, patterns, or regular expressions shared across intents or examples.
   * @example
   * weekdayNames ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
   * This would be referenced in phrases with "$ref=weekdayNames"
   */
  shared?: Record<string, string[]>;

  /**
   * A tokenizer to use during recognition instead of the basic tokenizer.
   * @default basicTokenize()
   */
  tokenizer?: Tokenizer;

  /**
   * A number between 0 and 1 indicating the max penalty for tokens being out of order.
   * @default 0.15
   */
  maxOutOfOrderPenalty?: number;

  /**
   * A number between 0 and 1 indicating the max penalty for unmatched tokens.
   * @default 0.05
   */
  maxNoisePenalty?: number;
};

/**
 * Recognizes an intent within some text.
 * @param text The input text to inspect.
 * @param intent The intent to recognize.
 * @param options Options for the recognize method.
 * @returns The recognition: a score, variable values, and details information.
 */
export const recognize = (
  text: string,
  intent: Intent,
  options?: RecognizeOptions
): IntentRecognition => {  

  const {
    maxOutOfOrderPenalty = 0.15,
    maxNoisePenalty = 0.05,
    shared,
    tokenizer = basicTokenize,
  } = options || {};

  if (maxOutOfOrderPenalty < 0 || maxOutOfOrderPenalty > 1) {
    throw new Error(
      "The maxOutOfOrderPenalty must be between 0 and 1 (inclusive)."
    );
  }

  if (maxNoisePenalty < 0 || maxNoisePenalty > 1) {
    throw new Error("The maxNoisePenalty must be between 0 and 1 (inclusive).");
  }

  const readyIntent = shared ? resolveIntentReferences(intent, shared) : intent;

  const tokenize = options?.tokenizer ?? basicTokenize;
  const textTokenMap = tokenize(text);

  const exampleRecognitions = readyIntent.examples.map((example) =>
    recognizeExample(
      example,
      textTokenMap,
      tokenizer,
      maxOutOfOrderPenalty,
      maxNoisePenalty
    )
  );

  const best = maxBy(exampleRecognitions, "score");

  return {
    name: readyIntent.name,
    score: best ? best.score : 0,
    details: {
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
