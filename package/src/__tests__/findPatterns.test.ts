import {
  findPatterns,
  _patternToRegularExpression as patternToRegularExpression,
} from "../findPatterns";
import { CharacterRange, CharacterRanges } from "../characterRange";

describe("findPatterns", () => {
  describe("patternToRegularExpression", () => {
    it.each([
      ["#", "\\d"], // digit
      ["@", "[a-zA-Z]"], //letter
      ["$", "\\w"], //word character
      ["!", "\\W"], //non-word character
      ["*", "\\w*"], //zero or more word characters
      ["^", "\\^"], //a set of regular expression meta-characters (escaped)
      ["(", "\\("],
      [")", "\\)"],
      ["+", "\\+"],
      ["[", "\\["],
      ["]", "\\]"],
      ["{", "\\{"],
      ["}", "\\}"],
      ["|", "\\|"],
      [".", "\\."],
      ["?", "\\?"],
      ["a", "a"], //lowercase
      ["A", "A"], //uppercase
      ["1", "1"], //numbers
      ["\\g", "\\g"], //escaped literals
      ["\\^", "\\^"], //escaped meta-characters
      ["##/##/####", "\\d\\d/\\d\\d/\\d\\d\\d\\d"], //date pattern
      [
        "(###)[@@@-###]?*",
        "\\(\\d\\d\\d\\)\\[[a-zA-Z][a-zA-Z][a-zA-Z]-\\d\\d\\d\\]\\?\\w*",
      ], //complex pattern
    ])("returns %p", (pattern, expected) => {
      expect(patternToRegularExpression(pattern)).toEqual(expected);
    });
    it("throws when pattern undefined", () => {
      expect(() =>
        patternToRegularExpression(undefined as unknown as string)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The pattern is undefined, null, or empty."`
      );
    });
    it("throws when pattern null", () => {
      expect(() =>
        patternToRegularExpression(null as unknown as string)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The pattern is undefined, null, or empty."`
      );
    });
    it("throws when pattern empty", () => {
      expect(() =>
        patternToRegularExpression("")
      ).toThrowErrorMatchingInlineSnapshot(
        `"The pattern is undefined, null, or empty."`
      );
    });
  });
  describe("findPatterns", () => {
    it("returns matches for pattern", () => {
      const expected = [
        CharacterRanges.create({ start: 27, end: 41 }),
        CharacterRanges.create({ start: 49, end: 59 }),
      ];

      const actual = findPatterns(
        ["#-###-###-####", "##/##/####"],
        "You can call the office at 1-800-555-1212 before 10/17/2025."
      );
      expect(actual).toEqual(expected);
    });

    it("returns empty when patterns empty", () => {
      const expected: CharacterRange[] = [];

      const actual = findPatterns(
        [],
        "You can call the office at 1-800-555-1212 before 10/17/2025."
      );
      expect(actual).toEqual(expected);
    });
    it("returns empty when patterns undefined", () => {
      const expected: CharacterRange[] = [];

      const actual = findPatterns(
        undefined as unknown as string[],
        "You can call the office at 1-800-555-1212 before 10/17/2025."
      );
      expect(actual).toEqual(expected);
    });
  });
});
