import { TextRange, TextRanges } from "./textRange";

export type TokenRange = TextRange & {
  kind: "tokenRange";
};

export namespace TokenRanges {
  /**
   * Creates a token range from a partial range.
   */
  export const create = (
    range: Partial<Omit<TokenRange, "kind">>
  ): TokenRange =>
    TextRanges.create<TokenRange>({ ...range, kind: "tokenRange" });

  /**
   * Returns true if the two token ranges are deeply equal; false otherwise.
   */
  export const equals: (x: TokenRange, y: TokenRange) => boolean =
    TextRanges.equals;

  /**
   * Returns true if the first token range contains the other token range; false otherwise.
   */
  export const contains: (x: TokenRange, y: TokenRange) => boolean =
    TextRanges.contains;

  /**
   * Returns true if the two token ranges overlap; false otherwise.
   */
  export const overlaps: (x: TokenRange, y: TokenRange) => boolean =
    TextRanges.overlaps;

  /**
   * Returns true if the token range is valid; false otherwise.
   */
  export const isValid: (range: TokenRange) => boolean = TextRanges.isValid;

  /**
   * Returns a formatted string of the [start..end](length)kind.
   */
  export const toString: (range: Partial<TokenRange>) => string =
    TextRanges.toString;

  /**
   * Validates the token range is valid and throws errors if not.
   */
  export const validate: (range: TokenRange) => void = TextRanges.validate;
}
