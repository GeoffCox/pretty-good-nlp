import { Intent } from "../types";

import { recognize } from "../recognizer";
import { CharacterRanges } from "../characterRange";
import { basicTokenize } from "../basicTokenizer";

const testText = "The quick brown fox jumps over the lazy dog.";

describe("recognizer modules", () => {
  describe("recognize", () => {
    it("returns score=1 when exactly recognized", () => {
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
      expect(actual.name).toEqual(intent.name);
      expect(actual.score).toEqual(1);
    });
    it("returns score=0 when unrecognized", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            name: "Trebel Clef lines",
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
            name: "The Earth’s Atmospheres",
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
      expect(actual.name).toEqual(intent.name);
      expect(actual.score).toEqual(0);
    });
    it("returns score=0 when examples empty", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [],
      };

      const actual = recognize(testText, intent);
      expect(actual.score).toEqual(0);
    });
    it("returns best score of multiple examples", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            name: "adjectives",
            parts: [
              {
                phrases: ["quick"],
              },
              {
                phrases: ["over"],
              },
              {
                phrases: ["lazy"],
              },
            ],
          },
          {
            name: "best",
            parts: [
              {
                phrases: ["the quick"],
              },
              {
                phrases: ["brown fox"],
              },
              {
                phrases: ["jumps over the"],
              },
              {
                phrases: ["dog"],
              },
            ],
          },
          {
            name: "nouns",
            parts: [
              {
                phrases: ["lazy dog"],
              },
              {
                phrases: ["brown fox"],
              },
            ],
          },
        ],
      };

      const actual = recognize(testText, intent);
      expect(actual.score).toEqual(0.9944444444444445);

      // verify examples in order and have correct scores.
      expect(actual.details.examples[0].name).toEqual("adjectives");
      expect(actual.details.examples[0].score).toEqual(0.9666666666666667);

      expect(actual.details.examples[1].name).toEqual("best");
      expect(actual.details.examples[1].score).toEqual(actual.score);

      expect(actual.details.examples[2].name).toEqual("nouns");
      expect(actual.details.examples[2].score).toEqual(0.8972222222222223);
    });
    it("returns variable values from best match", () => {
      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            name: "adjectives",
            parts: [
              {
                phrases: ["quick"],
              },
              {
                phrases: ["over"],
                variable: "preposition",
              },
              {
                phrases: ["lazy"],
              },
            ],
          },
          {
            name: "best",
            parts: [
              {
                phrases: ["the"],
              },
              {
                phrases: ["quick"],
                variable: "foxSpeed",
              },
              {
                phrases: ["brown"],
                variable: "foxColor",
              },
              {
                phrases: ["fox"],
              },
              {
                phrases: ["jumps over the"],
              },
              {
                phrases: ["dog"],
              },
            ],
          },
          {
            name: "nouns",
            parts: [
              {
                phrases: ["lazy"],
                variable: "dogType",
              },
              {
                phrases: ["dog"],
                variable: "dogType",
              },
              {
                phrases: ["blue"],
                variable: "foxColor",
              },
              {
                phrases: ["fox"],
              },
            ],
          },
        ],
      };

      const actual = recognize(testText, intent);
      expect(actual.variableValues["preposition"]).toBeUndefined();
      expect(actual.variableValues["dogType"]).toBeUndefined();
      expect(actual.variableValues["foxSpeed"]).toEqual(["quick"]);
      expect(actual.variableValues["foxColor"]).toEqual(["brown"]);
    });
    it("returns score using resolved references", () => {
      const shared = {
        actionsPhrases: ["jumps over"],
      };

      const intent: Intent = {
        name: "Test intent",
        examples: [
          {
            parts: [
              {
                phrases: ["The quick brown fox"],
              },
              {
                phrases: ["$ref=actionsPhrases"],
              },
              {
                phrases: ["the lazy dog"],
              },
            ],
          },
        ],
      };

      const actual = recognize(testText, intent, { shared });
      expect(actual.score).toEqual(1);
    });
    it("returns score using custom tokenizer", () => {
      const input = "The quick brown fox jumps over the lazy dog today";

      const tokenizer = (text: string) => {
        if (text === input) {
          return {
            text,
            characterRanges: [
              CharacterRanges.create({ start: 0, length: 3 }), //the
              CharacterRanges.create({ start: 4, length: 5 }), //quick
              CharacterRanges.create({ start: 10, length: 5 }), //brown
              CharacterRanges.create({ start: 16, length: 3 }), //fox
              CharacterRanges.create({ start: 20, length: 5 }), //jumps
              CharacterRanges.create({ start: 26, length: 4 }), //over
              CharacterRanges.create({ start: 31, length: 3 }), //the
              CharacterRanges.create({ start: 35, length: 4 }), //lazy
              CharacterRanges.create({ start: 40, length: 3 }), //dog
              CharacterRanges.create({ start: 44, length: 5 }), //today
            ],
          };
        }
        return basicTokenize(text);
      };

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
                phrases: ["the lazy dog"],
              },
            ],
          },
        ],
      };

      const actual = recognize(input, intent, { tokenizer });
      expect(actual.score).toEqual(0.995);
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
    it("throws error when passed maxOutOfOrderPenalty < 0", () => {
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
    it("throws error when passed maxNoisePenalty < 0", () => {
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
