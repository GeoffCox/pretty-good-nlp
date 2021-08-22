import { Intent } from "../types";

import { recognize } from "../recognizer";

const testText = "The quick brown fox jumps over the lazy dog.";

describe("recognizer modules", () => {
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
  "name": "Is typical sentence with all letters",
  "score": 1,
  "variableValues": Object {},
}
`);
    })
  });
});
