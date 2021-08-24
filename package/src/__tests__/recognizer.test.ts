import { Intent } from "../types";

import { recognize } from "../recognizer";

const testText = "The quick brown fox jumps over the lazy dog.";

describe("recognizer modules", () => {
  describe("recognize", () => {
    it("returns score=1 when matches exactly", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            parts: [
              {
                phrases: ["The quick brown fox"],
              },
              {
                phrases: ["jumps over"],
              },
              {
                phrases: ["The lazy dog"],
              },
            ],
          },
        ],
      };

      const actual = recognize(testText, intent);
      expect(actual.score).toEqual(1);
    });
    it("returns score=0 for intent when no examples match", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            name: 'Trebel Clef lines',
            parts: [
              {
                phrases: ["Every"],
              },
              {
                phrases: ["good boy"],
              },
              {
                phrases: ["deserves fudge"],
              },
            ],            
          },
          {
            name: 'The Earth’s Atmospheres',
            parts: [
              {
                phrases: ["The Strong Man’s"],
              },
              {
                phrases: ["Triceps Explode"],
              },
            ],
          },
        ],
      };

      const actual = recognize(testText, intent);
      expect(actual.score).toEqual(0);
    });
    it("returns score=0 for intent with empty parts", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            parts: [],
          },
        ],
      };

      const actual = recognize(testText, intent);
      expect(actual.score).toEqual(0);
    });
    it("recognizes intent", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            parts: [
              {
                phrases: ["The quick brown fox"],
              },
              {
                phrases: ["jumps over"],
              },
              {
                phrases: ["The lazy dog"],
              },
            ],
          },
          {
            parts: [
              {
                phrases: ["Every good boy"],
              },
              {
                phrases: ["deserves"],
              },
              {
                phrases: ["fudge"],
              },
            ],
          },
        ],
      };

      const actual = recognize(testText, intent);
      expect(actual).toMatchInlineSnapshot(`
Object {
  "details": Object {
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
          "inOrderMatchedPartCount": 3,
          "matchedNeverPartCount": 0,
          "matchedPartCount": 3,
          "matchedPartWeightSum": 3,
          "matchedTokenCount": 9,
          "partCount": 3,
          "partWeightSum": 3,
          "tokenCount": 9,
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
          "inOrderMatchedPartCount": 0,
          "matchedNeverPartCount": 0,
          "matchedPartCount": 0,
          "matchedPartWeightSum": 0,
          "matchedTokenCount": 0,
          "partCount": 3,
          "partWeightSum": 3,
          "tokenCount": 9,
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
  "name": "Test intent",
  "score": 1,
  "variableValues": Object {},
}
`);
    });
    it("throws error when passed maxOutOfOrderPenalty > 1", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [],
      };
      expect(() =>
        recognize(testText, intent, { maxOutOfOrderPenalty: 1.1 })
      ).toThrowErrorMatchingInlineSnapshot(
        `"The maxOutOfOrderPenalty must be between 0 and 1 (inclusive)."`
      );
    });
    it("throws error when passed maxOutOfOrderPenalty < 0>", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [],
      };
      expect(() =>
        recognize(testText, intent, { maxOutOfOrderPenalty: -0.1 })
      ).toThrowErrorMatchingInlineSnapshot(
        `"The maxOutOfOrderPenalty must be between 0 and 1 (inclusive)."`
      );
    });
    it("throws error when passed maxNoisePenalty > 1", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [],
      };
      expect(() =>
        recognize(testText, intent, { maxNoisePenalty: 1.1 })
      ).toThrowErrorMatchingInlineSnapshot(
        `"The maxNoisePenalty must be between 0 and 1 (inclusive)."`
      );
    });
    it("throws error when passed maxNoisePenalty < 0>", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [],
      };
      expect(() =>
        recognize(testText, intent, { maxNoisePenalty: -0.1 })
      ).toThrowErrorMatchingInlineSnapshot(
        `"The maxNoisePenalty must be between 0 and 1 (inclusive)."`
      );
    });
  });
});
