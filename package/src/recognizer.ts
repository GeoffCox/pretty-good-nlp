import maxBy from "lodash/maxBy";
import { basicTokenize } from "./basicTokenizer";
import { extractVariableValues } from "./extractVariableValues";
import { _findRegularExpressions } from "./findRegularExpressions";
import { recognizeExample } from "./recognizeExample";
import { resolveReferences } from "./referenceResolver";
import type {
  Intent,
  IntentRecognition,
  Tokenizer,
} from "./types";

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

  const readyIntent = shared ? resolveReferences(intent, shared) : intent;

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
