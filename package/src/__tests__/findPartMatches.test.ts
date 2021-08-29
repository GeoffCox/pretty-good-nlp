import { basicTokenize } from "../basicTokenizer";
import { ExamplePart, ExamplePartRecognition } from "../types";
import { CharacterRanges } from "../characterRange";

import { findPartMatches } from "../findPartMatches";

const testText = "The quick brown fox jumps over the lazy dog.";
const testTextTokenMap = basicTokenize(testText);

describe("findPartMatches", () => {
  it("returns matches for phrases", () => {
    const part: ExamplePart = {
      phrases: ["quick brown", "brown fox"],
    };

    const expected: ExamplePartRecognition = {
      matches: [
        CharacterRanges.create({ start: 4, length: 11 }), //quick brown
        CharacterRanges.create({ start: 10, length: 9 }), //brown fox
      ],
    };

    const actual = findPartMatches(part, testTextTokenMap, basicTokenize);

    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
  it("returns matches for patterns", () => {
    const part: ExamplePart = {
      patterns: ["$$$$$ over the", "*."],
    };

    const expected: ExamplePartRecognition = {
      matches: [
        CharacterRanges.create({ start: 20, length: 14 }), //jumps over the
        CharacterRanges.create({ start: 40, length: 4 }), //dog.
      ],
    };

    const actual = findPartMatches(part, testTextTokenMap, basicTokenize);

    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
  it("returns matches for regular expressions", () => {
    const part: ExamplePart = {
      regularExpressions: ["[a-zA-Z]{5} over the", "\\w*\\."],
    };

    const expected: ExamplePartRecognition = {
      matches: [
        CharacterRanges.create({ start: 20, length: 14 }), //jumps over the
        CharacterRanges.create({ start: 40, length: 4 }), //dog.
      ],
    };

    const actual = findPartMatches(part, testTextTokenMap, basicTokenize);

    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
  it("returns unique matches for duplicate matches", () => {
    const part: ExamplePart = {
      phrases: ["quick brown"],
      patterns: ["$$$$$ brown"],
      regularExpressions: ["quick [a-zA-Z]{5}"],
    };

    const expected: ExamplePartRecognition = {
      matches: [
        CharacterRanges.create({ start: 4, length: 11 }), //quick brown
      ],
    };

    const actual = findPartMatches(part, testTextTokenMap, basicTokenize);

    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
  it("returns part weight and variable", () => {
    const part: ExamplePart = {
      phrases: ["quick brown", "brown fox"],
      weight: 4,
      variable: "test",
    };

    const expected: ExamplePartRecognition = {
      matches: [
        CharacterRanges.create({ start: 4, length: 11 }), //quick brown
        CharacterRanges.create({ start: 10, length: 9 }), //brown fox
      ],
      weight: 4,
      variable: "test",
    };

    const actual = findPartMatches(part, testTextTokenMap, basicTokenize);

    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
});
