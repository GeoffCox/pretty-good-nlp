type TextRange$1 = {
  kind: string;
  start: number;
  length: number;
  end: number;
};

type TextRange = TextRange$1;

type CharacterRange$1 = TextRange & {
  kind: "characterRange";
};

type CharacterRange = CharacterRange$1;

type TokenMap = {
  text: string;
  characterRanges: CharacterRange[];
};

type SharedParts = {
  /**
   * Gets or sets the collection of shared phrases.
   * These can be merged into example part's phrases by $ref=name as a value.
   */
  phrases?: Record<string, string[]>;
  /**
   * Gets or sets the shared patterns.
   *These can be merged into an example part's patterns by $ref=name as a value.
   */
  patterns?: Record<string, string[]>;
  /**
   * Gets or sets the shared regular expressions.
   * These can be merged into an example part's regular expression by $ref=name as a value.
   */
  regularExpressions?: Record<string, string[]>;
};

/**
 * A part of an example identified by matching against literals, patterns, or regular expressions.
 */
type ExamplePart = {
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
type Example = {
  /**
   * Gets or sets the canonical form of this example.
   * For display only. Not used in recognition.
   */
  canonicalForm?: string;

  /**
   * Gets or sets the ordered list of parts expected for this example.
   * For the canonical form: I am going on vacation Monday.
   * [0] - Phrases = "I am","I'm","I will be","I'll"
   * [1] - Phrases = "going on", "going", "taking", "on"
   * [2] - Phrases = "vacation", "out of office", "leave", "away"
   * [3] - Phrases = "Monday", "Tuesday", ... , "Mon", "Tue", ...
   */
  parts: ExamplePart[];

  /**
   * Gets or sets the list of parts that will cause the example to never match
   */
  neverParts?: ExamplePart[];
};

/**
 *  An intention to be recognized by examining the user's input.
 */
type Intent = {
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

type ExamplePartRecognition = {
  matches: CharacterRange$1[];
  weight?: number;
  variable?: string;
};

type ExampleRecognition = {
  name?: string;
  parts: ExamplePartRecognition[];
  neverParts: ExamplePartRecognition[];
  score: number;
  scoreMetrics: Record<string, number>;
};

type IntentRecognition = {
  name: string;
  score: number;
  variableValues: Record<string, string[]>;
  details: {    
    bestExample?: ExampleRecognition;    
    examples: ExampleRecognition[];
    textTokenMap: TokenMap;
  };
};

type Tokenizer = (text: string) => TokenMap;

type ReferenceResolver = (items: string[]) => string[];

type MatchSorter = (matches: CharacterRange$1[]) => CharacterRange$1[];

type MatchSortFactory = () => MatchSorter;

export { CharacterRange$1 as CharacterRange, Example, ExamplePart, ExamplePartRecognition, ExampleRecognition, Intent, IntentRecognition, MatchSortFactory, MatchSorter, ReferenceResolver, SharedParts, TokenMap, Tokenizer };
