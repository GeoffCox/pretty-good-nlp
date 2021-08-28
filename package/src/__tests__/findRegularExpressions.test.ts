import { findRegularExpressions } from "../findRegularExpressions";
import {CharacterRange, CharacterRanges} from "../characterRange";

describe("findRegularExpressions", () => {
  describe("findRegularExpressions", () => {
    it("returns character ranges for a single occurance of an expression", () => {
      const text = "This is a phone number 555-1212 to call";
      const expressions = ["\\d\\d\\d-\\d\\d\\d\\d"];
      const expected = [
        CharacterRanges.create({ start: 23, length: 8 }),
      ];

      const actual = findRegularExpressions(expressions, text);
      expect(actual).toEqual(expected);
    });
    it("returns character ranges for multiple occurances of an expression", () => {
      const text =
        "This is a phone number 555-1212 to call. 555-1231 is another.";
      const expressions = ["\\d\\d\\d-\\d\\d\\d\\d"];
      const expected = [
        CharacterRanges.create({ start: 23, length: 8 }),
        CharacterRanges.create({ start: 41, length: 8 }),
      ];

      const actual = findRegularExpressions(expressions, text);
      expect(actual).toEqual(expected);
    });
    it("returns character ranges for multiple expressions", () => {
      const text =
        "This is a phone number 555-1212 to call. 555-1231 is another.";
      const expressions = ["phone number", "\\d\\d\\d-\\d\\d\\d\\d"];
      const expected = [
        CharacterRanges.create({ start: 10, end: 22 }),
        CharacterRanges.create({ start: 23, length: 8 }),
        CharacterRanges.create({ start: 41, length: 8 }),
      ];

      const actual = findRegularExpressions(expressions, text);
      expect(actual).toEqual(expected);
    });
    it("does not return character ranges for non-matching expressions", () => {
      const text =
        "This is a phone number 555-1212 to call. 55-1231 is another.";
      const expressions = ["\\d\\d\\d-\\d\\d\\d\\d", "anothers"];
      const expected = [
        CharacterRanges.create({ start: 23, length: 8 }),
      ];

      const actual = findRegularExpressions(expressions, text);
      expect(actual).toEqual(expected);
    });
    it("returns empty when expressions undefined", () => {
      const text = "This is a phone number 555-1212 to call";
      const expressions = undefined as unknown as string[];
      const expected: CharacterRange[] = [];
      const actual = findRegularExpressions(expressions, text);
      expect(actual).toEqual(expected);
    });
    it("returns character ranges when skipping undefined or empty expressions", () => {
      const text = "This is a phone number 555-1212 to call";
      const expressions = [
        "\\d\\d\\d-\\d\\d\\d\\d",
        "",
        undefined as unknown as string,
      ];
      const expected = [
        CharacterRanges.create({ start: 23, length: 8 }),
      ];

      const actual = findRegularExpressions(expressions, text);
      expect(actual).toEqual(expected);
    });
  });
});
