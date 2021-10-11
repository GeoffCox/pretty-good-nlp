import type { CharacterRange } from "./characterRange";
import { CharacterRanges } from "./characterRange";
import { _findRegularExpressions } from "./findRegularExpressions";
import type { TokenMap } from "./tokenMap";
import type { ExampleRecognition, ExampleScoreMetrics } from "./types";

/**
 * @internal
 */
export const scoreExample = (
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
  let missingRequiredPartCount = 0;
  let inOrderMatchedPartCount = 0;
  let lastEnd = -1;
  const bestMatches: CharacterRange[] = [];

  parts.forEach((part) => {
    const weight = part.weight !== undefined ? part.weight : 1;
    partWeightSum += weight;

    if (part.matches.length > 0) {
      matchedPartCount++;
      matchedPartWeightSum += weight;

      if (
        part.ignoreOrder ||
        lastEnd == -1 ||
        part.matches[0].start >= lastEnd
      ) {
        inOrderMatchedPartCount++;
      }
      lastEnd = part.matches[0].end;

      bestMatches.push(part.matches[0]);
    } else if (part.required) {
      missingRequiredPartCount++;
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

  // calculate scores
  let score = 0;
  if (partWeightSum > 0) {
    score = matchedPartWeightSum / partWeightSum;
  }
  if (matchedNeverPartCount !== 0) {
    score = 0;
  }
  if (missingRequiredPartCount !== 0) {
    score = 0;
  }

  const outOfOrderPercent =
    matchedPartCount > 0
      ? (matchedPartCount - inOrderMatchedPartCount) / matchedPartCount
      : 0;

  score -= outOfOrderPercent * maxOutOfOrderPenalty;

  const noisePercent =
    tokenCount > 0
      ? (textTokenMap.characterRanges.length - matchedTokenCount) / tokenCount
      : 0;
  score -= noisePercent * maxNoisePenalty;

  // ensure score between 0 and 1 inclusive
  score = Math.max(0, Math.min(1, score));

  return {
    score,
    metrics: {
      partCount: parts.length,
      matchedPartCount,
      missingRequiredPartCount,
      inOrderMatchedPartCount,
      matchedNeverPartCount,
      partWeightSum,
      matchedPartWeightSum,
      tokenCount,
      matchedTokenCount,
    },
  };
};
