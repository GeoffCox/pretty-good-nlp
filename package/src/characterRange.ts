import { TextRange, TextRanges } from "./textRange";

/**
 * Describes a range of characters within text.
 */
export type CharacterRange = TextRange & {
  /**
   * The kind of character range.   
   */
  kind: "characterRange";
};

/**
 * Functions for working with CharacterRange
 */
export namespace CharacterRanges {
  /**
   * Creates a character range from a partial range.
   */
  export const create = (
    range: Partial<Omit<CharacterRange, "kind">>
  ): CharacterRange =>
    TextRanges.create<CharacterRange>({ ...range, kind: "characterRange" });

  /**
   * Returns true if the two character ranges are deeply equal; false otherwise.
   */
  export const equals: (x: CharacterRange, y: CharacterRange) => boolean =
    TextRanges.equals;

  /**
   * Returns true if the first character range contains the other character range; false otherwise.
   */
  export const contains: (x: CharacterRange, y: CharacterRange) => boolean =
    TextRanges.contains;

  /**
   * Returns true if the two character ranges overlap; false otherwise.
   */
  export const overlaps: (x: CharacterRange, y: CharacterRange) => boolean =
    TextRanges.overlaps;

  /**
   * Returns true if the character range is valid; false otherwise.
   */
  export const isValid: (range: CharacterRange) => boolean = TextRanges.isValid;

  /**
   * Returns a formatted string of the [start..end](length)kind.
   */
  export const toString: (range: Partial<CharacterRange>) => string =
    TextRanges.toString;

  /**
   * Validates the character range is valid and throws errors if not.
   */
  export const validate = (range: CharacterRange, text?: string): void => {
    TextRanges.validate<CharacterRange>(range);

    if (text !== undefined) {
      if (range.start > text.length) {
        throw new Error(
          `The range start is beyond the end of the text. ${toString(range)}`
        );
      }

      if (range.end > text.length) {
        throw new Error(
          `The range end is beyond the end of the text. ${toString(range)}`
        );
      }
    }
  };
}
