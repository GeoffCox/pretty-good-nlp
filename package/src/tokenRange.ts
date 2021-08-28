import type { LinearRange } from "./linearRange";
import { LinearRanges } from "./linearRange";

/**
 * Describes a range of tokens (e.g. words) within text.
 */
export type TokenRange = LinearRange & {
  /**
   * The kind of token range.
   */
  kind: "tokenRange";
};

/**
 * Functions for working with TokenRange
 */
export namespace TokenRanges {
  /**
   * Creates a token range from a partial range.
   */
  export const create = (
    range: Partial<Omit<TokenRange, "kind">>
  ): TokenRange =>
    LinearRanges.create<TokenRange>({ ...range, kind: "tokenRange" });

  /**
   * Returns true if the two token ranges are deeply equal; false otherwise.
   */
  export const equals: (x: TokenRange, y: TokenRange) => boolean =
    LinearRanges.equals;

  /**
   * Returns true if the first token range contains the other token range; false otherwise.
   */
  export const contains: (x: TokenRange, y: TokenRange) => boolean =
    LinearRanges.contains;

  /**
   * Returns true if the two token ranges overlap; false otherwise.
   */
  export const overlaps: (x: TokenRange, y: TokenRange) => boolean =
    LinearRanges.overlaps;

  /**
   * Returns true if the token range is valid; false otherwise.
   */
  export const isValid: (range: TokenRange) => boolean = LinearRanges.isValid;

  /**
   * Returns a formatted string of the [start..end](length)kind.
   */
  export const toString: (range: Partial<TokenRange>) => string =
    LinearRanges.toString;

  /**
   * Validates the token range is valid and throws errors if not.
   */
  export const validate: (range: TokenRange) => void = LinearRanges.validate;
}
