import { tokenize } from "../basicTokenizer";
import {CharacterRanges} from "../characterRange";

import { UnitTestApi } from "../recognizer";

const {
  scoreExample,
} = UnitTestApi.recognizerModule;

const testText = "The quick brown fox jumps over the lazy dog.";
const testTextTokenMap = tokenize(testText);

describe("recognizer modules", () => {
  describe("scoreExample", () => {
    it("returns score of 1 for all matched", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          },
          {
            matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
        ],
        neverParts: [],
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(actual.score).toEqual(1);
    });
    it("returns score of 0 for no parts", () => {
      const example = {
        parts: [],
        neverParts: [],
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(actual.score).toEqual(0);
    });
    it("returns score of 0 for no matches", () => {
      const example = {
        parts: [
          {
            matches: [],
          },
          {
            matches: [],
          },
          {
            matches: [],
          },
        ],
        neverParts: [],
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(actual.score).toEqual(0);
    });
    it("returns score of 0 for for never match", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          },
          {
            matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
        ],
        neverParts: [
          {
            matches: [CharacterRanges.create({ start: 16, length: 3 })], //fox
          },
        ],
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(actual.score).toEqual(0);
    });
    it("returns score for matches and non-matches", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
        ],
        neverParts: [],
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(Math.floor(actual.score * 100)).toEqual(98);
    });
    it("returns score for matches and partial non-matches", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          },
          {
            matches: [
              CharacterRanges.create({ start: 31, length: 13 }), //the lazy dog
              CharacterRanges.create({ start: 26, length: 4 }), //over
            ], //over the
          },
        ],
        neverParts: [],
      };
      
      const actual = scoreExample(example, testTextTokenMap);
      expect(Math.floor(actual.score * 100)).toEqual(98);
    });
    it("returns score for weighted part matches", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
            weight: 0,
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
            weight: 4,
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
        ],
        neverParts: [],
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(Math.floor(actual.score * 100)).toEqual(98);
    });
    it("returns score for ordered matches", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
          },
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          },
        ],
        neverParts: [],
      };

      const actual = scoreExample(example, testTextTokenMap);
      // score: 4/4 weight = 1
      // -= 2/4 out of order * .15 = -7.5
      // -= 0/9 noise * 0.05 = 0
      // = 0.92.5
      expect(Math.floor(actual.score * 100)).toEqual(92);
    });
    it("returns metrics", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          },
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
            weight: 16,
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
        ],
        neverParts: [
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
          },
        ],
      };

      const expected = {
        inOrderMatchedPartCount: 2,
        matchedNeverPartCount: 1,
        matchedPartCount: 3,
        matchedPartWeightSum: 18,
        matchedTokenCount: 7,
        partCount: 3,
        partWeightSum: 18,
        tokenCount: 9,
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(actual.metrics).toEqual(expected);
    });
  });
});
