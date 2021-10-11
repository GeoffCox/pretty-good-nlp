import { basicTokenize } from "../basicTokenizer";
import { CharacterRanges } from "../characterRange";

import { scoreExample } from "../scoreExample";

const testText = "The quick brown fox jumps over the lazy dog.";
const testTextTokenMap = basicTokenize(testText);

describe("scoreExample", () => {
  it("returns score of 1 when all matched", () => {
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
          required: true
        },
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
        },
      ],
      neverParts: [],
    };

    const actual = scoreExample(example, testTextTokenMap, 1, 1);
    expect(actual.score).toEqual(1);
  });
  it("returns score of 0 when no parts", () => {
    const example = {
      parts: [],
      neverParts: [],
    };

    const actual = scoreExample(example, testTextTokenMap, 0, 0);
    expect(actual.score).toEqual(0);
  });
  it("returns score of 0 when no matches", () => {
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

    const actual = scoreExample(example, testTextTokenMap, 0, 0);
    expect(actual.score).toEqual(0);
  });
  it("returns score of 0 when required part missing", () => {
    const example = {
      parts: [
        {          
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
        },
        {
          matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
        },
        {
          matches: [],
          required: true
        },
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
        },
      ],
      neverParts: [],
    };

    const actual = scoreExample(example, testTextTokenMap, 0, 0);
    expect(actual.score).toEqual(0);
  });
  it("returns score of 0 when never matches", () => {
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

    const actual = scoreExample(example, testTextTokenMap, 0, 0);
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

    const actual = scoreExample(example, testTextTokenMap, 0.15, 0.05);
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

    const actual = scoreExample(example, testTextTokenMap, 0.15, 0.05);
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

    const actual = scoreExample(example, testTextTokenMap, 0.15, 0.05);
    expect(Math.floor(actual.score * 100)).toEqual(98);
  });
  it("returns score based on in order and out of order matches", () => {
    const example = {
      parts: [
        {
          matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
        },
        {
          // Out of order
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
        },
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
        },
        {
          // Out of order
          matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
        },
      ],
      neverParts: [],
    };

    const actual = scoreExample(example, testTextTokenMap, 0.15, 0.05);
    // score: 4/4 weight = 1
    // -= 2/4 out of order * .15 = -7.5
    // -= 0/9 noise * 0.05 = 0
    // = 0.92.5
    expect(Math.floor(actual.score * 100)).toEqual(92);
  });
  it("returns score for ordered matches when ignoreOrder defined on out of order part.", () => {
    const example = {
      parts: [
        {
          matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
        },   
        {
          // Out of order
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          ignoreOrder: true
        },     
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog
        },        
        {
          // Out of order
          matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
        },
      ],
      neverParts: [],
    };

    const actual = scoreExample(example, testTextTokenMap, 0.15, 0.05);
    // score: 4/4 weight = 1
    // -= 1/4 out of order * .15 = -3.75
    // -= 0/9 noise * 0.05 = 0
    // = 96.25
    expect(Math.floor(actual.score * 100)).toEqual(96);
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
      missingRequiredPartCount: 0,
      inOrderMatchedPartCount: 2,
      matchedNeverPartCount: 1,
      matchedPartCount: 3,
      matchedPartWeightSum: 18,
      matchedTokenCount: 7,
      partCount: 3,
      partWeightSum: 18,
      tokenCount: 9,
    };

    const actual = scoreExample(example, testTextTokenMap, 0.15, 0.05);
    expect(actual.metrics).toEqual(expected);
  });
});
