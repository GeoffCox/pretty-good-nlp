import {CharacterRange, CharacterRanges} from "../characterRange";
import {TokenRange, TokenRanges} from "../tokenRange";
import { TokenMap, TokenMaps } from "../tokenMap";


const testTokenMap = {
  text: "The quick brown fox",
  characterRanges: [
    CharacterRanges.create({
      start: 0,
      end: 3,
    }),
    CharacterRanges.create({
      start: 4,
      end: 9,
    }),
    CharacterRanges.create({
      start: 10,
      end: 15,
    }),
    CharacterRanges.create({
      start: 16,
      end: 19,
    }),
  ],
};

describe("tokenMap module", () => {
  describe("getCharacterRange", () => {
    it("returns character ranges", () => {
      const tokenRange = TokenRanges.create({
        start: 1,
        length: 2,
      });

      const actual = TokenMaps.getCharacterRange(testTokenMap, tokenRange);
      expect(actual).toBeDefined();
      expect(actual.kind).toEqual("characterRange");
      expect(actual.start).toEqual(4);
      expect(actual.end).toEqual(15);
      expect(actual.length).toEqual(11);
    });
    it("returns empty character ranges when length zero", () => {
      const tokenRange = TokenRanges.create({
        start: 2,
        end: 2,
      });

      const actual = TokenMaps.getCharacterRange(testTokenMap, tokenRange);
      expect(actual).toBeDefined();
      expect(actual.kind).toEqual("characterRange");
      expect(actual.start).toEqual(0);
      expect(actual.end).toEqual(0);
      expect(actual.length).toEqual(0);
    });
    it("throws when tokenMap is invalid", () => {
      const tokenMap = {
        text: "",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
        ],
      };

      const tokenRange = TokenRanges.create({
        start: 1,
        end: 1,
      });

      expect(() =>
        TokenMaps.getCharacterRange(tokenMap, tokenRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range end is beyond the end of the text. [0..3](3) kind:characterRange"`
      );
    });
    it("throws when tokenRange is invalid", () => {
      const tokenRange = {
        kind: "tokenRange",
        start: 0,
        end: -1,
        length: 1,
      } as TokenRange;

      expect(() =>
        TokenMaps.getCharacterRange(testTokenMap, tokenRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range end is negative. [0..-1](1) kind:tokenRange"`
      );
    });
    it("throws when tokenRange.start greater than number of character ranges", () => {
      const tokenRange = TokenRanges.create({
        start: 4,
        end: 4,
      });

      expect(() =>
        TokenMaps.getCharacterRange(testTokenMap, tokenRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Token range start is greater than the number of character ranges."`
      );
    });
    it("throws when tokenRange.end greater than number of character ranges", () => {
      const tokenRange = TokenRanges.create({
        start: 2,
        end: 5,
      });

      expect(() =>
        TokenMaps.getCharacterRange(testTokenMap, tokenRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Token range end is greater than the number of character ranges."`
      );
    });
  });
  describe("getTokens", () => {
    it("returns tokens", () => {
      const actual = TokenMaps.getTokens(testTokenMap);
      expect(actual).toBeDefined();
      expect(actual.length).toEqual(4);
      expect(actual[0]).toEqual("The");
      expect(actual[1]).toEqual("quick");
      expect(actual[2]).toEqual("brown");
      expect(actual[3]).toEqual("fox");
    });
    it("returns empty when no tokens", () => {
      const tokenMap = {
        text: "",
        characterRanges: [],
      };

      const actual = TokenMaps.getTokens(tokenMap);
      expect(actual).toBeDefined();
      expect(actual.length).toEqual(0);
    });
    it("throws when tokenMap is invalid", () => {
      const tokenMap = {
        text: "",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
        ],
      };

      expect(() =>
        TokenMaps.getTokens(tokenMap)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range end is beyond the end of the text. [0..3](3) kind:characterRange"`
      );
    });
  });
  describe("getTextForCharacterRange", () => {
    it("returns text", () => {
      const characterRange = CharacterRanges.create({
        start: 0,
        end: 7,
      });
      const actual = TokenMaps.getTextForCharacterRange(
        testTokenMap,
        characterRange
      );
      expect(actual).toEqual("The qui");
    });
    it("throws when tokenMap is invalid", () => {
      const tokenMap = {
        text: "",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
        ],
      };

      const characterRange = CharacterRanges.create({
        start: 0,
        end: 7,
      });

      expect(() =>
        TokenMaps.getTextForCharacterRange(tokenMap, characterRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range end is beyond the end of the text. [0..3](3) kind:characterRange"`
      );
    });
    it("throws when characterRange is invalid", () => {
      const characterRange = CharacterRanges.create({
        start: 22,
        end: 27,
      });

      expect(() =>
        TokenMaps.getTextForCharacterRange(testTokenMap, characterRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range start is beyond the end of the text. [22..27](5) kind:characterRange"`
      );
    });
  });
  describe("getTextForTokenRange", () => {
    it("returns text", () => {
      const tokenRange = TokenRanges.create({
        start: 1,
        length: 2,
      });
      const actual = TokenMaps.getTextForTokenRange(testTokenMap, tokenRange);
      expect(actual).toEqual("quick brown");
    });
    it("throws when tokenMap is invalid", () => {
      const tokenMap = {
        text: "",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
        ],
      };

      const tokenRange = TokenRanges.create({
        start: 1,
        length: 1,
      });

      expect(() =>
        TokenMaps.getTextForTokenRange(tokenMap, tokenRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range end is beyond the end of the text. [0..3](3) kind:characterRange"`
      );
    });
    it("throws when tokenRange is invalid", () => {
      const tokenRange = TokenRanges.create({
        start: 14,
        length: 1,
      });

      expect(() =>
        TokenMaps.getTextForTokenRange(testTokenMap, tokenRange)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Token range start is greater than the number of character ranges."`
      );
    });
  });
  describe("getTokenAtIndex", () => {
    it("returns text", () => {
      const actual = TokenMaps.getTokenAtIndex(testTokenMap, 2);
      expect(actual).toEqual("brown");
    });
    it("throws when tokenMap is invalid", () => {
      const tokenMap = {
        text: "",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
        ],
      };

      expect(() =>
        TokenMaps.getTokenAtIndex(tokenMap, 1)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range end is beyond the end of the text. [0..3](3) kind:characterRange"`
      );
    });
    it("throws when tokenIndex less than 0", () => {
      expect(() =>
        TokenMaps.getTokenAtIndex(testTokenMap, -3)
      ).toThrowErrorMatchingInlineSnapshot(`"The tokenIndex is negative."`);
    });

    it("throws when tokenIndex greater than number of tokens", () => {
      expect(() =>
        TokenMaps.getTokenAtIndex(testTokenMap, 16)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The tokenIndex is greater than the number of tokens."`
      );
    });
  });
  describe("validate", () => {
    it("does not throw for valid token map", () => {
      TokenMaps.validate(testTokenMap);
    });
    it("throws when tokenMap is undefined", () => {
      const tokenMap = undefined as unknown as TokenMap;
      expect(() =>
        TokenMaps.validate(tokenMap)
      ).toThrowErrorMatchingInlineSnapshot(`"The tokenMap is undefined."`);
    });
    it("throws when tokenMap.text is undefined", () => {
      const tokenMap = {
        characterRanges: [],
      } as unknown as TokenMap;
      expect(() =>
        TokenMaps.validate(tokenMap)
      ).toThrowErrorMatchingInlineSnapshot(`"The text is undefined."`);
    });
    it("throws when tokenMap.characterRanges is undefined", () => {
      const tokenMap = {
        text: "The quick brown fox",
      } as unknown as TokenMap;
      expect(() =>
        TokenMaps.validate(tokenMap)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The characterRanges array is undefined."`
      );
    });
    it("throws when tokenMap.characterRanges contains invalid character range", () => {
      const tokenMap = {
        text: "The quick brown fox",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
          CharacterRanges.create({
            start: 4,
            end: 9,
          }),
          CharacterRanges.create({
            start: 10,
            end: 15,
          }),
          {
            kind: "characterRange",
            start: 19,
            end: 16,
            length: 4,
          } as CharacterRange,
        ],
      };
      expect(() =>
        TokenMaps.validate(tokenMap)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The range length doesn't equal end minus start. [19..16](4) kind:characterRange"`
      );
    });
    it("throws when tokenMap.characterRanges overlap", () => {
      const tokenMap = {
        text: "The quick brown fox",
        characterRanges: [
          CharacterRanges.create({
            start: 0,
            end: 3,
          }),
          CharacterRanges.create({
            start: 4,
            end: 9,
          }),
          CharacterRanges.create({
            start: 8,
            end: 15,
          }),
          CharacterRanges.create({
            start: 16,
            end: 19,
          }),
        ],
      };
      expect(() =>
        TokenMaps.validate(tokenMap)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Token map character range overlaps previous character range end. [8..15](7) kind:characterRange"`
      );
    });
  });
});
