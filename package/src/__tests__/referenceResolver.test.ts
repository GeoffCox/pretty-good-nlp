import { resolveIntentReferences, UnitTestApi } from "../referenceResolver";
import { Intent } from "../types";

const { resolveReferences, resolvePartReferences } =
  UnitTestApi.referenceResolverModule;

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
  describe("resolveReferences", () => {
    it("resolves single reference", () => {
      const items = ["$ref=phrasesA"];
      const expected = testShared.phrasesA;
      const actual = resolveReferences(items, testShared);
      expect(actual).toEqual(expected);
    });
    it("resolves references in order", () => {
      const items = ["$ref=phrasesC", "$ref=phrasesA", "$ref=phrasesB"];
      const expected = [
        ...testShared.phrasesC,
        ...testShared.phrasesA,
        ...testShared.phrasesB,
      ];
      const actual = resolveReferences(items, testShared);
      expect(actual).toEqual(expected);
    });
    it("resolves references and keeps non-references", () => {
      const items = [
        "first",
        "$ref=phrasesC",
        "second",
        "$ref=phrasesA",
        "third",
        "$ref=phrasesB",
        "fourth",
      ];
      const expected = [
        "first",
        ...testShared.phrasesC,
        "second",
        ...testShared.phrasesA,
        "third",
        ...testShared.phrasesB,
        "fourth",
      ];
      const actual = resolveReferences(items, testShared);
      expect(actual).toEqual(expected);
    });
    it("does not resolve non-references", () => {
      const items = ["$ref=phrasesA", "$ref=phrases404", "$ref=phrasesB"];
      const expected = [
        ...testShared.phrasesA,
        "$ref=phrases404",
        ...testShared.phrasesB,
      ];
      const actual = resolveReferences(items, testShared);
      expect(actual).toEqual(expected);
    });
  });  
  describe("resolvePartReferences", () => {
    it("resolves phrase references", () => {
      const actual = { phrases: ["$ref=phrasesA", "$ref=phrasesC"] };

      const expected = {
        phrases: [...testShared.phrasesA, ...testShared.phrasesC],
      };

      resolvePartReferences(actual, testShared);
      expect(actual).toEqual(expected);
    });
    it("resolves pattern references", () => {
      const actual = { patterns: ["$ref=patternsB", "$ref=patternsC"] };

      const expected = {
        patterns: [...testShared.patternsB, ...testShared.patternsC],
      };

      resolvePartReferences(actual, testShared);
      expect(actual).toEqual(expected);
    });
    it("resolves regularExpression references", () => {
      const actual = { regularExpressions: ["$ref=regExpsC", "$ref=regExpsA"] };

      const expected = {
        regularExpressions: [...testShared.regExpsC, ...testShared.regExpsA],
      };

      resolvePartReferences(actual, testShared);
      expect(actual).toEqual(expected);
    });
    it("resolves phrase, pattern, and regularExpression references", () => {
      const actual = {
        phrases: ["$ref=phrasesA", "$ref=phrasesC"],
        patterns: ["$ref=patternsB", "$ref=patternsC"],
        regularExpressions: ["$ref=regExpsC", "$ref=regExpsA"],
      };

      const expected = {
        phrases: [...testShared.phrasesA, ...testShared.phrasesC],
        patterns: [...testShared.patternsB, ...testShared.patternsC],
        regularExpressions: [...testShared.regExpsC, ...testShared.regExpsA],
      };

      resolvePartReferences(actual, testShared);
      expect(actual).toEqual(expected);
    });
    it("no-op when phrase, pattern, and regularExpression empty in part", () => {
      const actual = {
        phrases: [],
        patterns: [],
        regularExpressions: []
      };
      const expected = {
        phrases: [],
        patterns: [],
        regularExpressions: []
      };
      resolvePartReferences(actual, testShared);
      expect(actual).toEqual(expected);
    });
    it("no-op when phrase, pattern, and regularExpression undefined in part", () => {
      const actual = {};
      const expected = {};
      resolvePartReferences(actual, testShared);
      expect(actual).toEqual(expected);
    });
  });
  describe("resolveIntentReferences", () => {
    it("resolves reference for intent", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [
          {
            name: "example1",
            parts: [{ phrases: ["$ref=phrasesA"] }],
          },
          {
            name: "example2",
            parts: [{ phrases: ["$ref=phrasesB"] }],
            neverParts: [{ patterns: ["$ref=patternsA"] }],
          },
          {
            name: "example3",
            parts: [],
            neverParts: [{ phrases: ["$ref=phrasesC"] }],
          },
        ],
      };

      const expected = {
        name: "Test Intent",
        examples: [
          {
            name: "example1",
            parts: [{ phrases: [...testShared.phrasesA] }],
          },
          {
            name: "example2",
            parts: [{ phrases: [...testShared.phrasesB] }],
            neverParts: [{ patterns: [...testShared.patternsA] }],
          },
          {
            name: "example3",
            parts: [],
            neverParts: [{ phrases: [...testShared.phrasesC] }],
          },
        ],
      }

      const actual = resolveIntentReferences(intent, testShared);
      expect(actual).toEqual(expected);
    });
    it("no-op for intent with empty examples", () => {
      const intent: Intent = {
        name: "Test Intent",
        examples: [],
      };

      const expected = {
        name: "Test Intent",
        examples: [],
      }

      const actual = resolveIntentReferences(intent, testShared);
      expect(actual).toEqual(expected);
    });   
  });
});
