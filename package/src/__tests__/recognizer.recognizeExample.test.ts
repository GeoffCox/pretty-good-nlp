import { tokenize } from "../basicTokenizer";
import { Example } from "../types";
import { CharacterRanges} from "../characterRange";

import { UnitTestApi } from "../recognizer";

const {
  recognizeExample,
} = UnitTestApi.recognizerModule;

const testText = "The quick brown fox jumps over the lazy dog.";
const testTextTokenMap = tokenize(testText);

describe("recognizer modules", () => {
  describe("recognizeExample", () => {
    it("return result when no parts nor neverParts", () => {
      const example = {
        parts: [],
        neverParts: [],
      };

      const actual = recognizeExample(example, testTextTokenMap, tokenize);
      expect(actual.score).toEqual(0);
      expect(actual.parts).toEqual([]);
      expect(actual.neverParts).toEqual([]);
    });
    it("return result for empty string", () => {
      const example: Example = {
        parts: [
          {
            phrases: ["The quick"],
          },
          {
            phrases: ["fox jumps"],
          },
        ],
        neverParts: [],
      };

      const text = "";
      const textTokenMap = tokenize(text);

      const actual = recognizeExample(example, textTokenMap, tokenize);
      expect(actual.score).toEqual(0);
      expect(actual.parts).toEqual([
        {
          matches: [],
        },
        {
          matches: [],
        },
      ]);
      expect(actual.neverParts).toEqual([]);
    });
    it("return result for part matches", () => {
      const example: Example = {
        canonicalForm: "test example",
        parts: [
          {
            phrases: ["The quick"],
          },
          {
            phrases: ["fox jumps"],
          },
        ],
        neverParts: [],
      };

      const actual = recognizeExample(example, testTextTokenMap, tokenize);
      
      expect(Math.floor(actual.score * 100)).toEqual(97);
      expect(actual.name).toEqual(example.canonicalForm);
      expect(actual.parts).toEqual([
        {
          matches: [CharacterRanges.create({ start: 0, length: 9 })],
        },
        {
          matches: [CharacterRanges.create({ start: 16, length: 9 })],
        },
      ]);
      expect(actual.neverParts).toEqual([]);
    });
    it("return result for never part matches", () => {
      const example: Example = {
        canonicalForm: "test example",
        parts: [],
        neverParts: [
          {
            phrases: ["The quick"],
          },
          {
            phrases: ["fox jumps"],
          },
        ],
      };

      const actual = recognizeExample(example, testTextTokenMap, tokenize);

      expect(actual.score).toEqual(0);
      expect(actual.name).toEqual(example.canonicalForm);
      expect(actual.parts).toEqual([]);
      expect(actual.neverParts).toEqual([
        {
          matches: [CharacterRanges.create({ start: 0, length: 9 })],
        },
        {
          matches: [CharacterRanges.create({ start: 16, length: 9 })],
        },
      ]);
    });
  });    
});
