import type { CharacterRange } from "./characterRange";
import type { TokenMap } from "./tokenMap";

/**
 * A method that breaks up a continuous string of text into a map of tokens.
 */
export type Tokenizer = (text: string) => TokenMap;

/**
 * A part of an example identified by matching against literals, patterns, or regular expressions.
 */
export type ExamplePart = {
  /**
   * Gets or sets the name of this part.
   */
  name?: string;

  /**
   * Gets or sets the list of literal phrases for this part of the example.
   */
  phrases?: string[];

  /**
   * Gets or sets the patterns for this part of the example.
   * * = zero or more letters and/or numbers (A-z0-9 case insensitive)
   * @ = any single letter (A-z case insensitive)
   * # = any single number (0-9)
   * $ = any single letter or number
   * - = any punctuation
   * \ = escape (to support @,#,$,*, - and \ as literals)
   */
  patterns?: string[];

  /**
   * Gets or sets the regular expressions for this part of the example.
   */
  regularExpressions?: string[];

  /**
   * Gets or sets the weight of this matching part.
   */
  weight?: number;

  /**
   * Gets or sets the variable name to associate with this part's value when matched.
   */
  variable?: string;
};

/**
 * An example that when matched indicates an intent.
 */
export type Example = {
  /**
   * Gets or sets the name of this example.
   */
  name?: string;

  /**
   * Gets or sets the ordered list of parts expected for this example.
   *
   * For the canonical form: I am going on vacation Monday.
   * - [0] - Phrases = "I am","I'm","I will be","I'll"
   * - [1] - Phrases = "going on", "going", "taking", "on"
   * - [2] - Phrases = "vacation", "out of office", "leave", "away"
   * - [3] - Phrases = "Monday", "Tuesday", ... , "Mon", "Tue", ...
   */
  parts: ExamplePart[];

  /**
   * Gets or sets the list of parts that will cause the example to never match.
   */
  neverParts?: ExamplePart[];
};

/**
 *  An intention to be recognized by examining the user's input.
 */
export type Intent = {
  /**
   * Gets or sets the name of the intent
   */
  name: string;
  /**
   * Gets or sets the list of examples indicating this intent.
   * Ordering is only used to break score ties.
   */
  examples: Example[];
};

/**
 * The result of recognizing an example part.
 */
export type ExamplePartRecognition = {
  /**
   * Gets or sets the name of this part.
   */
  name?: string;

  /** The ranges of the matches for this part in order from best to worst. */
  matches: CharacterRange[];

  /** The weight from the corresponding example part. */
  weight?: number;

  /** True if this part is required. Score will be zero if missing. */
  required?: boolean;

  /** True if this part can appear in any order within the example. */
  ignoreOrder?: boolean;

  /** The option variable name from the corresponding example part. */
  variable?: string;
};

/**
 * A set of metrics specific to the recognition algorithm.
 */
export type ExampleScoreMetrics = {
  /** The number of example parts */
  partCount: number;
  /** The number of example parts that matched. */
  matchedPartCount: number;
  /** The number of required example parts that are missing. */
  missingRequiredPartCount: number;
  /** The number of matched example parts that were in order. */
  inOrderMatchedPartCount: number;
  /** The number of example never parts that matched. */
  matchedNeverPartCount: number;
  /** The sum of the weights of the example parts. */
  partWeightSum: number;
  /** The sum of the weights of the matched example parts. */
  matchedPartWeightSum: number;
  /** The number of tokens in the input text. */
  tokenCount: number;
  /** The number of tokens in the input text that matched. */
  matchedTokenCount: number;
};

/**
 * The result of recognizing an example.
 */
export type ExampleRecognition = {
  /**
   * The name of the example.
   */
  name?: string;
  /**
   * The score between 0 and 1 indicating if the text matches this example.
   */
  score: number;
  /**
   * The recognition of this example's parts.
   */
  parts: ExamplePartRecognition[];
  /**
   * The recognition of this example's never parts.
   */
  neverParts: ExamplePartRecognition[];
  /**
   * Detailed metrics about this example recognition.
   */
  scoreMetrics: ExampleScoreMetrics;
};

/**
 * The result of recognizing and intent.
 */
export type IntentRecognition = {
  /**
   * The intent name.
   */
  name: string;
  /**
   * The score between 0 and 1 indicating if the text is this intent.
   */
  score: number;
  /**
   * A collection variable names and values extracted from the text.
   */
  variableValues: Record<string, string[]>;
  /**
   * Details specific to the recognition algorithm.
   */
  details: {
    /**
     * The recognition of each example.
     * Examples remain in the order they were specified in the intent.
     */
    examples: ExampleRecognition[];
    /**
     * The token map of the input text.
     */
    textTokenMap: TokenMap;
  };
};
