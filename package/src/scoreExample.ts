import type { CharacterRange } from "./characterRange";
import { CharacterRanges } from "./characterRange";
import { _findRegularExpressions } from "./findRegularExpressions";
import type { TokenMap } from "./tokenMap";
import type {
  ExampleRecognition,
  ExampleScoreMetrics,
} from "./types";

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
