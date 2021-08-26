import { resolveIntentReferences } from "../referenceResolver";
import { Intent } from "../types";

const testShared = {
  phrasesA: ["phrasesA1", "phrasesA2", "phrasesA3"],
  phrasesB: ["phrasesB1", "phrasesB2", "phrasesB3"],
  phrasesC: ["phrasesC1", "phrasesC2", "phrasesC3"],
  patternsA: ["patternsA1", "patternsA2", "patternsA3"],
  patternsB: ["patternsB1", "patternsB2", "patternsB3"],
  patternsC: ["patternsC1", "patternsC2", "patternsC3"],
  regExpsA: ["regExpsA1", "regExpsA2", "regExpsA3"],
  regExpsB: ["regExpsB1", "regExpsB2", "regExpsB3"],
  regExpsC: ["regExpsC1", "regExpsC2", "regExpsC3"],
};

describe("referenceResolver", () => {
  describe("resolveIntentReferences", () => {
    it("returns resolved shared references", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [
          {
            name: "<example>",
            parts: [
              // single item
              { phrases: ["$ref=phrasesA"] },
              // items in reverse order
              { patterns: ["$ref=patternsB", "$ref=patternsA"] },
              // items with non-ref items around them.
              {
                regularExpressions: [
                  "regEx1",
                  "$ref=regExpsA",
                  "regEx2",
                  "$ref=regExpsC",
                  "regEx3",
                ],
              },
            ],
          },
        ],
      };
      const actual = resolveIntentReferences(intent, testShared);

      const expected: Intent = {
        name: "Test Intent",
        examples: [
          {
            name: "<example>",
            parts: [
              {
                phrases: ["phrasesA1", "phrasesA2", "phrasesA3"],
              },
              {
                patterns: [
                  "patternsB1",
                  "patternsB2",
                  "patternsB3",
                  "patternsA1",
                  "patternsA2",
                  "patternsA3",
                ],
              },
              {
                regularExpressions: [
                  "regEx1",
                  "regExpsA1",
                  "regExpsA2",
                  "regExpsA3",
                  "regEx2",
                  "regExpsC1",
                  "regExpsC2",
                  "regExpsC3",
                  "regEx3",
                ],
              },
            ],
          },
        ],
      };

      expect(actual).toEqual(expected);
    });

    /*
    it("no-op when shared refs undefined", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [{ name: "<example>", parts: [] }],
      };
      resolveSharedReferences(intent);
    });
    it("no-op when examples undefined", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: undefined as unknown as Example[],
        sharedPhrases: {
          numbers: numberPhrases,
          sizes: sizePhrases,
        },
        sharedPatterns: {
          phoneNumbers: phonePatterns,
        },
        sharedRegularExpressions: {
          dates: dateRegularExpressions,
        },
      };
      resolveSharedReferences(intent);
    });
    */
  });
});
