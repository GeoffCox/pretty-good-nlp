import { tokenize } from "../basicTokenizer";
import { Example, ExamplePart, ExamplePartRecognition, Intent } from "../types";
import * as CharacterRanges from "../characterRange";

import { recognize, UnitTestApi } from "../recognizer";

const {
  findPartMatches,
  scoreExample,
  extractVariableValues,
  recognizeExample,
} = UnitTestApi.recognizerModule;

const testText = "The quick brown fox jumps over the lazy dog.";
const testTextTokenMap = tokenize(testText);

describe("recognizer modules", () => {
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

      const actual = findPartMatches(part, testTextTokenMap, tokenize);

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

      const actual = findPartMatches(part, testTextTokenMap, tokenize);

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

      const actual = findPartMatches(part, testTextTokenMap, tokenize);

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

      const actual = findPartMatches(part, testTextTokenMap, tokenize);

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

      const actual = findPartMatches(part, testTextTokenMap, tokenize);

      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
  });
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

      // possible: 4.5 = 3 parts + 1/2 for each in order
      // actual: 4 = 3 parts + 1/2 for 3 parts in order - 1/4 for 2 non-matched tokens
      // expected: 0.8888888888888888
      const actual = scoreExample(example, testTextTokenMap);
      expect(Math.round(actual.score * 100)).toEqual(89);
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

      // possible: 4.5 = 3 parts + 1/2 for each in order
      // actual: 4 = 3 parts + 1/2 for 3 parts in order - 1/4 for 2 non-matched tokens
      // expected: 0.8888888888888888
      const actual = scoreExample(example, testTextTokenMap);
      expect(Math.round(actual.score * 100)).toEqual(89);
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

      // possible: 6.5 = 3 part weights (0 + 4 + 1) + 1/2 for each in order
      // actual: 6 = 3 parts (0 + 4 + 1) + 1/2 for 3 parts in order - 1/4 for 2 non-matched tokens
      // expected: 0.9230769230769231
      const actual = scoreExample(example, testTextTokenMap);
      expect(Math.round(actual.score * 100)).toEqual(92);
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
      // possible: 6 = 4 parts + 1/2 for each in order
      // actual: 5 = 4 parts + 1/2 for 2 parts in order
      // expected: 0.8333333333333333
      expect(Math.round(actual.score * 100)).toEqual(83);
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
        actualScore: 0,
        inOrder: 2,
        matches: 3,
        matchWeightSum: 18,
        neverMatches: 1,
        unmatched: 2,
        parts: 3,
        possibleScore: 19.5,
        partWeightSum: 18,
      };

      const actual = scoreExample(example, testTextTokenMap);
      expect(actual.metrics).toEqual(expected);
    });
  });
  describe("extractVariableValues", () => {
    it("returns values when variables match", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
            variable: "subject",
          },
          {
            matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog.
            variable: "directObject",
          },
        ],
      };
      const actual = extractVariableValues(testText, example);
      expect(actual).toBeDefined();
      expect(Object.keys(actual).length).toEqual(2);
      expect(actual.subject).toEqual(["brown fox"]);
      expect(actual.directObject).toEqual(["the lazy dog."]);
    });
    it("returns values in order when variables match multiple times", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
            variable: "subject",
          },
          {
            matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
          },
          {
            matches: [
              CharacterRanges.create({ start: 31, length: 13 }), //the lazy dog.
              CharacterRanges.create({ start: 35, length: 8 }), //lazy dog
            ], //the lazy dog
            variable: "directObject",
          },
        ],
      };
      const actual = extractVariableValues(testText, example);
      expect(actual).toBeDefined();
      expect(Object.keys(actual).length).toEqual(2);
      expect(actual.subject).toEqual(["brown fox"]);
      expect(actual.directObject).toEqual(["the lazy dog.", "lazy dog"]);
    });
    it("returns no value when variable defined but no matches", () => {
      const example = {
        parts: [
          {
            matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
          },
          {
            matches: [],
            variable: "subject",
          },
          {
            matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
          },
          {
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog.
            variable: "directObject",
          },
        ],
      };
      const actual = extractVariableValues(testText, example);
      expect(actual).toBeDefined();
      expect(Object.keys(actual).length).toEqual(1);
      expect(actual.directObject).toEqual(["the lazy dog."]);
    });
    it("returns empty when matches and no variables defined", () => {
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
            matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog.
          },
        ],
      };
      const actual = extractVariableValues(testText, example);
      expect(actual).toBeDefined();
      expect(actual).toEqual({});
    });
    it("returns empty when no parts", () => {
      const example = {
        parts: [],
      };
      const actual = extractVariableValues(testText, example);
      expect(actual).toBeDefined();
      expect(actual).toEqual({});
    });
  });
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

      // possible: 3 = 2 parts + 1/2 for each in order
      // actual: 1.75 = 2 parts + 1/2 for 2 parts in order - 1.4 for 5 unmatched
      // expected: 0.5833333333333334
      expect(Math.round(actual.score * 100)).toEqual(58);
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
  describe("recognize", () => {
    it("recognizes intent", () => {
        const intent : Intent = {
            name: "Is typical sentence with all letters",
            examples: [
                {
                    parts: [{
                        phrases: ["The quick brown fox"],

                    },
                    {
                        phrases: ["jumps over"],
                    },
                    {
                        phrases: ["The lazy dog"],
                    }]
                },
                {
                    parts: [{
                        phrases: ["Every good boy"],
                    },
                    {
                        phrases: ["deserves"],
                    },
                    {
                        phrases: ["fudge"],
                    }]
                }
            ]
        };

        const actual = recognize(testText, intent);

        expect(actual).toMatchInlineSnapshot(`
Object {
  "details": Object {
    "bestExample": Object {
      "name": undefined,
      "neverParts": Array [],
      "parts": Array [
        Object {
          "matches": Array [
            Object {
              "end": 19,
              "kind": "characterRange",
              "length": 19,
              "start": 0,
            },
          ],
          "variable": undefined,
          "weight": undefined,
        },
        Object {
          "matches": Array [
            Object {
              "end": 30,
              "kind": "characterRange",
              "length": 10,
              "start": 20,
            },
          ],
          "variable": undefined,
          "weight": undefined,
        },
        Object {
          "matches": Array [
            Object {
              "end": 43,
              "kind": "characterRange",
              "length": 12,
              "start": 31,
            },
          ],
          "variable": undefined,
          "weight": undefined,
        },
      ],
      "score": 1,
      "scoreMetrics": Object {
        "actualScore": 4.5,
        "inOrder": 3,
        "matchWeightSum": 3,
        "matches": 3,
        "neverMatches": 0,
        "partWeightSum": 3,
        "parts": 3,
        "possibleScore": 4.5,
        "unmatched": 0,
      },
    },
    "examples": Array [
      Object {
        "name": undefined,
        "neverParts": Array [],
        "parts": Array [
          Object {
            "matches": Array [
              Object {
                "end": 19,
                "kind": "characterRange",
                "length": 19,
                "start": 0,
              },
            ],
            "variable": undefined,
            "weight": undefined,
          },
          Object {
            "matches": Array [
              Object {
                "end": 30,
                "kind": "characterRange",
                "length": 10,
                "start": 20,
              },
            ],
            "variable": undefined,
            "weight": undefined,
          },
          Object {
            "matches": Array [
              Object {
                "end": 43,
                "kind": "characterRange",
                "length": 12,
                "start": 31,
              },
            ],
            "variable": undefined,
            "weight": undefined,
          },
        ],
        "score": 1,
        "scoreMetrics": Object {
          "actualScore": 4.5,
          "inOrder": 3,
          "matchWeightSum": 3,
          "matches": 3,
          "neverMatches": 0,
          "partWeightSum": 3,
          "parts": 3,
          "possibleScore": 4.5,
          "unmatched": 0,
        },
      },
      Object {
        "name": undefined,
        "neverParts": Array [],
        "parts": Array [
          Object {
            "matches": Array [],
            "variable": undefined,
            "weight": undefined,
          },
          Object {
            "matches": Array [],
            "variable": undefined,
            "weight": undefined,
          },
          Object {
            "matches": Array [],
            "variable": undefined,
            "weight": undefined,
          },
        ],
        "score": 0,
        "scoreMetrics": Object {
          "actualScore": 0,
          "inOrder": 0,
          "matchWeightSum": 0,
          "matches": 0,
          "neverMatches": 0,
          "partWeightSum": 3,
          "parts": 3,
          "possibleScore": 3,
          "unmatched": 9,
        },
      },
    ],
    "textTokenMap": Object {
      "characterRanges": Array [
        Object {
          "end": 3,
          "kind": "characterRange",
          "length": 3,
          "start": 0,
        },
        Object {
          "end": 9,
          "kind": "characterRange",
          "length": 5,
          "start": 4,
        },
        Object {
          "end": 15,
          "kind": "characterRange",
          "length": 5,
          "start": 10,
        },
        Object {
          "end": 19,
          "kind": "characterRange",
          "length": 3,
          "start": 16,
        },
        Object {
          "end": 25,
          "kind": "characterRange",
          "length": 5,
          "start": 20,
        },
        Object {
          "end": 30,
          "kind": "characterRange",
          "length": 4,
          "start": 26,
        },
        Object {
          "end": 34,
          "kind": "characterRange",
          "length": 3,
          "start": 31,
        },
        Object {
          "end": 39,
          "kind": "characterRange",
          "length": 4,
          "start": 35,
        },
        Object {
          "end": 43,
          "kind": "characterRange",
          "length": 3,
          "start": 40,
        },
      ],
      "text": "The quick brown fox jumps over the lazy dog.",
    },
  },
  "name": "Is typical sentence with all letters",
  "score": 1,
  "variableValues": Object {},
}
`);
    })
  });
});
