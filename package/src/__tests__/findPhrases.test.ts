import { tokenize } from "../basicTokenizer";
import { findPhrases } from "../findPhrases";
import {CharacterRange, CharacterRanges} from "../characterRange";

const testText = "The quick brown fox jumps over the lazy dog";
const testTextTokens = tokenize(testText);

describe("findPhrases module", () => {
  it("returns matches", () => {
    const phrases = ["brown fox", "the lazy", "The quick brown"];
    const expected = [
      CharacterRanges.create({ start: 0, end: 15 }), //The quick brown
      CharacterRanges.create({ start: 10, end: 19 }), //brown fox
      CharacterRanges.create({ start: 31, end: 39 }), //the lazy
    ];

    const actual = findPhrases(phrases, testTextTokens, tokenize);
    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
  it("returns empty if phrases empty", () => {
    const phrases: string[] = [];
    const expected: CharacterRange[] = [];

    const actual = findPhrases(phrases, testTextTokens, tokenize);
    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
  it("returns empty if phrases undefined", () => {
    const phrases: string[] = undefined as unknown as string[];
    const expected: CharacterRange[] = [];

    const actual = findPhrases(phrases, testTextTokens, tokenize);
    expect(actual).toBeDefined();
    expect(actual).toEqual(expected);
  });
});
