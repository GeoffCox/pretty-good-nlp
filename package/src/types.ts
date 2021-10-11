import type { CharacterRange } from "./characterRange";
import type { TokenMap } from "./tokenMap";

/**
 * A method that breaks up a text into a map of tokens.
 */
export type Tokenizer = (text: string) => TokenMap;

/**
 * A part of an example identified by matching against phrases, patterns, or regular expressions.
 */
export type ExamplePart = {
  /**
   * The name of this part.
   */
  name?: string;

  /**
   * The list of literal phrases for this part of the example.
   */
  phrases?: string[];

  /**
   * The patterns for this part of the example.
   * * = zero or more letters and/or numbers (A-z0-9 case insensitive)
   * @ = any single letter (A-z case insensitive)
   * # = any single number (0-9)
   * $ = any single letter or number
   * - = any punctuation
   * \ = escape (to support @,#,$,*, - and \ as literals)
   */
  patterns?: string[];

  /**
   * The regular expressions for this part of the example.
   */
  regularExpressions?: string[];

  /**
   * The weight of this part relative to other parts in the example.
   * @default 1
   */
  weight?: number;

  /** 
   * If this part is required. 
   * The score will be zero if part is missing. 
   */
  required?: boolean;

  /** 
   * If this part can appear in any order within the example. 
   */
  ignoreOrder?: boolean;

  /**
   * The variable name to associate with this part's value when matched.
   */
  variable?: string;
};

/**
 * A part of an example identified by matching against phrases, patterns, or regular expressions.
 * A match of a never part anywhere in the text causes an example to have a score of zero.
 */
export type NeverPart = Pick<ExamplePart, "name" | "phrases" | "patterns" | "regularExpressions">;

/**
 * An example that when matched indicates an intent.
 */
export type Example = {
  /**
   * The name of this example.
   */
  name?: string;

  /**
   * The ordered list of parts expected for this example.
   *
   * For the canonical form: I am going on vacation Monday.
   * - [0] - Phrases = "I am","I'm","I will be","I'll"
   * - [1] - Phrases = "going on", "going", "taking", "on"
   * - [2] - Phrases = "vacation", "out of office", "leave", "away"
   * - [3] - Phrases = "Monday", "Tuesday", ... , "Mon", "Tue", ...
   */
  parts: ExamplePart[];

  /**
   * The list of parts that will cause this example to score 0 if any are matched.
   */
  neverParts?: NeverPart[];
};

/**
 *  An intention to be recognized by examining the user's input.
 */
export type Intent = {
  /**
   * The name of this intent.
   */
  name: string;
  /**
   * The list of examples that, when matched, indicate this intent.   
   */
  examples: Example[];
};

/**
 * The result of recognizing an example part.
 */
export type ExamplePartRecognition = Omit<ExamplePart, "phrases" | "patterns" | "regularExpresisons"> & {
  /** 
   * The matches for this part in order from best to worst. 
   */
  matches: CharacterRange[];
};

/**
 * The resulting matches of never parts.
 */
 export type NeverPartRecognition = Omit<NeverPart, "phrases" | "patterns" | "regularExpresisons"> & {
  /** The ranges of the matches for this part in order from best to worst. */
  matches: CharacterRange[];
};

/**
 * A set of metrics specific to the recognition algorithm.
 */
export type ExampleScoreMetrics = {
  /** 
   * The number of example parts.
   */
  partCount: number;
  /** 
   * The number of example parts that matched. 
   */
  matchedPartCount: number;
  /** 
   * The number of required example parts that are missing. 
   */
  missingRequiredPartCount: number;
  /** 
   * The number of matched example parts that were in order. 
   */
  inOrderMatchedPartCount: number;
  /** 
   * The number of example never parts that matched. 
   */
  matchedNeverPartCount: number;
  /** 
   * The sum of the weights of the example parts. 
   */
  partWeightSum: number;
  /** 
   * The sum of the weights of the matched example parts. 
   */
  matchedPartWeightSum: number;
  /** 
   * The number of tokens in the input text. 
   */
  tokenCount: number;
  /** 
   * The number of tokens in the input text that matched. 
   */
  matchedTokenCount: number;
};

/**
 * The result of recognizing an example.
 */
export type ExampleRecognition = Omit<Example, "parts" | "neverParts"> & { 
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
  neverParts: NeverPartRecognition[];
  /**
   * Detailed metrics about this example recognition.
   */
  scoreMetrics: ExampleScoreMetrics;
};

/**
 * The result of recognizing and intent.
 */
export type IntentRecognition = Omit<Intent, "examples"> & {  
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
