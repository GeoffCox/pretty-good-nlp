import {
  addTokensToTrieNode,
  TrieNode,
  trieSearch,
  validateTrieNode,
} from "../trieSearch";

import {CharacterRange} from "../characterRange";
import {TokenRanges} from "../tokenRange";

const testTextTokens = [
  "The",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "the",
  "lazy",
  "dog",
];

// Produces a compact, comparable string for expect
const trieNodeToComparableString = (node: TrieNode): string => {
  const handleNode = (result: string[], node: TrieNode, key: string) => {
    const startIds = node.startIds ? `[${node.startIds?.join(",")}]-` : "";
    const endIds = node.endIds ? `-[${node.endIds?.join(",")}]` : "";

    const name = `${startIds}${key}${endIds}`;
    result.push(name);

    if (node.children) {
      const childKeys = Object.keys(node.children);
      if (childKeys.length > 0) {
        result.push(` {`);
        childKeys.forEach((childKey, i) => {
          if (node.children) {
            handleNode(result, node.children[childKey], childKey);
            if (i < childKeys.length - 1) {
              result.push(` | `);
            }
          }
        });
        result.push(`} `);
      }
    }
  };

  const result: string[] = [];
  if (node.children) {
    Object.keys(node.children).forEach((childKey) => {
      if (node.children) {
        handleNode(result, node.children[childKey], childKey);
      }
    });
  }
  return result.join("");
};

describe("trieSearch module", () => {
  describe("addTokensToTrieNode", () => {
    it("returns trie for token sequence", () => {
      const tokens = ["The", "quick", "brown", "fox"];
      const node: TrieNode = { children: {} };
      addTokensToTrieNode(tokens, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(
        `"[0]-the {quick {brown {fox-[0]} } } "`
      );
    });
    it("returns trie for node without children", () => {
      const tokens = ["The", "quick", "brown", "fox"];
      const node: TrieNode = {} as unknown as TrieNode;
      addTokensToTrieNode(tokens, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(
        `"[0]-the {quick {brown {fox-[0]} } } "`
      );
    });
    it("returns trie for multiple sequences", () => {
      const tokens0 = ["The", "quick", "brown", "fox"];
      const tokens1 = ["jumps", "over", "the"];
      const tokens3 = ["lazy", "dog"];
      const node: TrieNode = {};
      addTokensToTrieNode(tokens0, node);
      addTokensToTrieNode(tokens1, node);
      addTokensToTrieNode(tokens3, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(
        `"[0]-the {quick {brown {fox-[0]} } } [1]-jumps {over {the-[1]} } [2]-lazy {dog-[2]} "`
      );
    });
    it("returns trie for overlapping sequences", () => {
      const tokens0 = ["The", "quick", "brown", "fox"];
      const tokens1 = ["The", "quick", "brown"];
      const tokens2 = ["The", "quick", "fox", "jumps"];
      const tokens3 = ["The", "fox", "jumps", "over"];
      const node: TrieNode = {};
      addTokensToTrieNode(tokens0, node);
      addTokensToTrieNode(tokens1, node);
      addTokensToTrieNode(tokens2, node);
      addTokensToTrieNode(tokens3, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(
        `"[0,1,2,3]-the {quick {brown-[1] {fox-[0]}  | fox {jumps-[2]} }  | fox {jumps {over-[3]} } } "`
      );
    });
    it("returns trie for sequence with empty or undefined tokens", () => {
      const tokens = [
        "The",
        "",
        "quick",
        null as unknown as string,
        "brown",
        undefined as unknown as string,
        "fox",
      ];
      const node: TrieNode = {};
      addTokensToTrieNode(tokens, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(
        `"[0]-the {quick {brown {fox-[0]} } } "`
      );
    });
    it("returns trie for single token", () => {
      const tokens = ["The"];
      const node: TrieNode = {};
      addTokensToTrieNode(tokens, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(`"[0]-the-[0]"`);
    });
    it("returns trie for empty sequence", () => {
      const tokens: string[] = [];
      const node: TrieNode = {};
      addTokensToTrieNode(tokens, node);

      const actual = trieNodeToComparableString(node);
      expect(actual).toMatchInlineSnapshot(`""`);
    });
    it("throw when searchTokens undefined", () => {
      expect(() =>
        addTokensToTrieNode(undefined as unknown as string[], {})
      ).toThrowErrorMatchingInlineSnapshot(
        `"The searchTokens array argument is undefined or null."`
      );
    });
    it("throw when node undefined", () => {
      expect(() =>
        addTokensToTrieNode([], undefined as unknown as TrieNode)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The node parameter is not defined."`
      );
    });
  });
  describe("validateTrieNode", () => {
    it("does not throw when node valid", () => {
      const node: TrieNode = {};
      addTokensToTrieNode(["The", "quick", "brown", "fox"], node);
      validateTrieNode(node);
    });
    it("does not throw for empty node", () => {
      const node: TrieNode = {};
      validateTrieNode(node);
    });
    it("throws when root node is null", () => {
      expect(() =>
        validateTrieNode(null as unknown as TrieNode)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The node parameter is not defined."`
      );
    });
    it("throws when root node has start IDs", () => {
      const node: TrieNode = {
        startIds: [1, 2],
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The root node has start IDs. Direct children of the root node should start phrases."`
      );
    });
    it("throws when root node has end IDs", () => {
      const node: TrieNode = {
        endIds: [1, 2],
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The root node has end IDs. Descendants of the root node should end phrases."`
      );
    });
    it("throws when root node's children has keys with undefined nodes", () => {
      const node: TrieNode = {
        children: {
          the: undefined as unknown as TrieNode,
        },
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The the node is not defined."`
      );
    });
    it("throws when root node's direct child has no start IDs", () => {
      const node: TrieNode = {
        children: {
          the: {},
        },
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The the node is missing a start ID."`
      );
    });
    it("throws when intermediate node has start IDs", () => {
      const node: TrieNode = {
        children: {
          the: {
            startIds: [0],
            children: {
              quick: {
                startIds: [1],
                children: {
                  fox: {
                    endIds: [0, 1],
                  },
                },
              },
            },
          },
        },
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The quick node is an intermediate or end node but has a start ID."`
      );
    });
    it("throws when a child node has no children and no end IDs", () => {
      const node: TrieNode = {
        children: {
          the: {
            startIds: [0],
          },
        },
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The the node is missing an end ID and has no children."`
      );
    });
    it("throws when a child node has keys with undefined nodes", () => {
      const node: TrieNode = {
        children: {
          the: {
            children: {
              quick: undefined as unknown as TrieNode,
            },
            startIds: [0],
          },
        },
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The quick node is not defined."`
      );
    });
    it("throws when a grandchild node has keys with undefined nodes", () => {
      const node: TrieNode = {
        children: {
          the: {
            children: {
              quick: {
                children: {
                  brown: undefined as unknown as TrieNode,
                },
              },
            },
            startIds: [0],
          },
        },
      };
      expect(() => validateTrieNode(node)).toThrowErrorMatchingInlineSnapshot(
        `"The brown node is not defined."`
      );
    });
  });
  describe("trieSearch", () => {
    it("returns match for single phrase", () => {
      const node: TrieNode = {};
      const tokens = ["brown", "fox", "jumps"];
      addTokensToTrieNode(tokens, node);

      const expected = [
        TokenRanges.create({
          start: 2,
          length: 3,
        }),
      ];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("returns empty for non-matching phrase", () => {
      const node: TrieNode = {};
      const tokens = ["jumps", "over", "fox"];
      addTokensToTrieNode(tokens, node);

      const expected: CharacterRange[] = [];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("returns empty for partially-matching phrase", () => {
      const node: TrieNode = {};
      const tokens = ["jumps", "over", "dog"];
      addTokensToTrieNode(tokens, node);

      const expected: CharacterRange[] = [];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("returns matches for multiple phrases", () => {
      const node: TrieNode = {};
      addTokensToTrieNode(["the", "quick"], node);
      addTokensToTrieNode(["fox", "jumps"], node);
      addTokensToTrieNode(["dog"], node);

      const expected = [
        TokenRanges.create({
          start: 0,
          length: 2,
        }),
        TokenRanges.create({
          start: 3,
          length: 2,
        }),
        TokenRanges.create({
          start: 8,
          length: 1,
        }),
      ];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("returns matches for phrases overlap at start", () => {
      const node: TrieNode = {};
      // overlap at start
      addTokensToTrieNode(["brown", "fox", "jumps"], node);
      addTokensToTrieNode(["brown", "fox", "jumps", "over"], node);

      const expected = [
        TokenRanges.create({
          start: 2,
          length: 3,
        }),
        TokenRanges.create({
          start: 2,
          length: 4,
        }),
      ];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("returns matches for phrases overlap at end", () => {
      const node: TrieNode = {};
      addTokensToTrieNode(["quick", "brown", "fox", "jumps"], node);
      addTokensToTrieNode(["brown", "fox", "jumps"], node);

      const expected = [
        TokenRanges.create({
          start: 1,
          length: 4,
        }),
        TokenRanges.create({
          start: 2,
          length: 3,
        }),
      ];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("returns matches for phrases overlap within", () => {
      const node: TrieNode = {};
      addTokensToTrieNode(["quick", "brown", "fox", "jumps"], node);
      addTokensToTrieNode(["brown", "fox"], node);

      const expected = [
        TokenRanges.create({
          start: 2,
          length: 2,
        }),
        TokenRanges.create({
          start: 1,
          length: 4,
        }),
      ];

      const actual = trieSearch(testTextTokens, node);
      expect(actual).toBeDefined();
      expect(actual).toEqual(expected);
    });
    it("throw when textTokens undefined", () => {
      expect(() =>
        trieSearch(undefined as unknown as string[], {})
      ).toThrowErrorMatchingInlineSnapshot(
        `"The textTokens array argument is undefined or null."`
      );
    });
    it("throw when node undefined", () => {
      expect(() =>
        trieSearch([], undefined as unknown as TrieNode)
      ).toThrowErrorMatchingInlineSnapshot(
        `"The node parameter is not defined."`
      );
    });
  });
});
