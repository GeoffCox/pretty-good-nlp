import type { CharacterRange } from "./characterRange";
import { CharacterRanges } from "./characterRange";
import type { TokenRange } from "./tokenRange";
import { TokenRanges } from "./tokenRange";
import sortBy from "lodash/sortBy";

/**
 * The result of tokenizing text into a collection of character ranges; one per token.
 */
export type TokenMap = {
  text: string;
  characterRanges: CharacterRange[];
};

/**
 * Functions for working with TokenMap
 */
export namespace TokenMaps {

  /**
   * Gets the character range corresponding to a token range 
   */
  export const getCharacterRange = (
    tokenMap: TokenMap,
    tokenRange: TokenRange
  ) : CharacterRange => {
    validate(tokenMap);
    TokenRanges.validate(tokenRange);

    const { characterRanges } = tokenMap;

    if (tokenRange.start >= characterRanges.length) {
      throw new Error(
        "Token range start is greater than the number of character ranges."
      );
    }

    if (tokenRange.end > characterRanges.length) {
      throw new Error(
        "Token range end is greater than the number of character ranges."
      );
    }

    if (tokenRange.length === 0) {
      return CharacterRanges.create({});
    }

    const start = characterRanges[tokenRange.start].start;
    const end = characterRanges[tokenRange.end - 1].end;

    return CharacterRanges.create({
      start,
      end,
    });
  };

  /**
   * Gets the text of each token.
   */
  export const getTokens = (tokenMap: TokenMap) : string[] => {
    validate(tokenMap);

    return tokenMap.characterRanges.map((characterRange) => {
      return tokenMap.text.substring(characterRange.start, characterRange.end);
    });
  };

  /**
   * Gets the text of a character range.
   */
  export const getTextForCharacterRange = (
    tokenMap: TokenMap,
    characterRange: CharacterRange
  ) => {
    validate(tokenMap);
    const { text } = tokenMap;
    CharacterRanges.validate(characterRange, text);
    return text.substring(characterRange.start, characterRange.end);
  };

  /**
   * Gets the text of a token range.
   */
  export const getTextForTokenRange = (
    tokenMap: TokenMap,
    tokenRange: TokenRange
  ) => {
    validate(tokenMap);
    TokenRanges.validate(tokenRange);

    return getTextForCharacterRange(
      tokenMap,
      getCharacterRange(tokenMap, tokenRange)
    );
  };

  /**
   * Gets the text of token at the specified index.
   */
  export const getTokenAtIndex = (tokenMap: TokenMap, tokenIndex: number) : string => {
    validate(tokenMap);

    if (tokenIndex < 0) {
      throw new Error("The tokenIndex is negative.");
    }
    if (tokenIndex >= tokenMap.characterRanges.length) {
      throw new Error("The tokenIndex is greater than the number of tokens.");
    }
    const range = tokenMap.characterRanges[tokenIndex];
    return tokenMap.text.substring(range.start, range.end);
  };

  /**
   * Validates a token map.
   */
  export const validate = (tokenMap: TokenMap) => {
    if (tokenMap === undefined) {
      throw new Error("The tokenMap is undefined.");
    }

    const { characterRanges, text } = tokenMap;

    if (text === undefined) {
      throw new Error("The text is undefined.");
    }

    if (characterRanges === undefined) {
      throw new Error("The characterRanges array is undefined.");
    }

    const orderedRanges = sortBy(characterRanges, ["start", "end"]);
    let index = -1;
    for (let i = 0; i < orderedRanges.length; i++) {
      const characterRange = orderedRanges[i];
      CharacterRanges.validate(characterRange, text);
      if (characterRange.start < index) {
        throw new Error(
          `Token map character range overlaps previous character range end. ${CharacterRanges.toString(
            characterRanges[i]
          )}`
        );
      }

      index = characterRange.end;
    }
  };
}
