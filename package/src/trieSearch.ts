import type { TokenRange } from "./tokenRange";
import { TokenRanges } from "./tokenRange";

/**
 * @internal
 */
export type TrieNode = {
  children?: Record<string, TrieNode>;
  startIds?: number[];
  endIds?: number[];
};

const validateChildNode = (
  node: TrieNode,
  key: string,
  isRootChild: boolean
) => {
  const hasStartIds = node.startIds && node.startIds.length > 0;

  // First children must have a start ID
  if (isRootChild) {
    if (!hasStartIds) {
      throw new Error(`The ${key} node is missing a start ID.`);
    }
  } else if (hasStartIds) {
    // No other children can have a start ID
    throw new Error(
      `The ${key} node is an intermediate or end node but has a start ID.`
    );
  }

  // Any child without children must end a phrase
  if (!node.children || Object.keys(node.children).length === 0) {
    if (!node.endIds || node.endIds.length === 0) {
      throw new Error(
        `The ${key} node is missing an end ID and has no children.`
      );
    }
  } else {
    const nodeChildren = node.children;
    // Validate each child
    Object.keys(nodeChildren).forEach((key) => {
      const child = nodeChildren[key];
      if (!child) {
        throw new Error(`The ${key} node is not defined.`);
      }
      validateChildNode(child, key, false);
    });
  }
};

/**
 * @internal
 */
export const validateTrieNode = (node: TrieNode) => {
  if (!node) {
    throw new Error("The node parameter is not defined.");
  }

  if (node.startIds && node.startIds.length > 0) {
    throw new Error(
      "The root node has start IDs. Direct children of the root node should start phrases."
    );
  }

  if (node.endIds && node.endIds.length > 0) {
    throw new Error(
      "The root node has end IDs. Descendants of the root node should end phrases."
    );
  }

  // Validate children
  if (node.children) {
    const nodeChildren = node.children;
    Object.keys(nodeChildren).forEach((key) => {
      const child = nodeChildren[key];
      if (!child) {
        throw new Error(`The ${key} node is not defined.`);
      }
      validateChildNode(child, key, true);
    });
  }
};

/**
 * @internal
 */
export const addTokensToTrieNode = (searchTokens: string[], node: TrieNode) => {
  if (!searchTokens) {
    throw new Error("The searchTokens array argument is undefined or null.");
  }

  validateTrieNode(node);

  if (searchTokens.length === 0) {
    return;
  }

  if (!node.children) {
    node.children = {};
  }

  // I give each token sequence an ID
  const searchId = Object.values(node.children).reduce<number>(
    (sum, current) => {
      const startNode = current as { startIds: number[] };
      return sum + startNode.startIds.length;
    },
    0
  );

  const validSearchTokens = searchTokens
    .map((token) => token?.trim())
    .filter(Boolean);

  let currentNode = node;
  validSearchTokens.forEach((token, i) => {
    const tokenKey = token.toLowerCase();

    currentNode.children = currentNode.children || {};
    currentNode.children[tokenKey] = currentNode.children[tokenKey] || {};
    currentNode = currentNode.children[tokenKey];

    // Mark the first token as the start of the sequence
    if (i === 0) {
      currentNode.startIds = currentNode.startIds || [];
      currentNode.startIds.push(searchId);
    }

    // Mark the last token as the end of the sequence
    if (i === validSearchTokens.length - 1) {
      currentNode.endIds = currentNode.endIds || [];
      currentNode.endIds.push(searchId);
    }
  });
};

type InProgressTrieNode = {
  children: Record<string, TrieNode>;
  startIds?: number[];
  endIds?: number[];
};

/**
 * @internal
 */
export const trieSearch = (textTokens: string[], node: TrieNode) => {
  if (!textTokens) {
    throw new Error("The textTokens array argument is undefined or null.");
  }

  validateTrieNode(node);

  const result: TokenRange[] = [];
  const inProgressNodes: InProgressTrieNode[] = [];
  const matchStarts: Record<number, number> = {};

  textTokens.forEach((token, i) => {
    const textToken = token.trim();
    const tokenKey = textToken.toLowerCase();

    let p = 0;
    while (p < inProgressNodes.length) {
      const progressNode = inProgressNodes[p].children[tokenKey];
      if (progressNode) {
        progressNode.endIds?.forEach((endId) => {
          const start = matchStarts[endId];
          const tokenRange = TokenRanges.create({
            start: start,
            end: i + 1,
          });
          result.push(tokenRange);
        });

        if (
          progressNode.children &&
          Object.keys(progressNode.children).length > 0
        ) {
          inProgressNodes[p] = progressNode as InProgressTrieNode;
          p++;
        } else {
          inProgressNodes.splice(p, 1);
        }
      } else {
        inProgressNodes.splice(p, 1);
      }
    }

    const firstChildNode = node.children?.[tokenKey];
    if (firstChildNode) {
      // only first children have start IDs
      const startIds = firstChildNode.startIds as number[];
      startIds.forEach((startId) => (matchStarts[startId] = i));

      // a first child could be both an end and a start
      firstChildNode.endIds?.forEach((endId) => {
        const start = matchStarts[endId];
        const tokenRange = TokenRanges.create({
          start: start,
          end: i + 1,
        });

        result.push(tokenRange);
      });

      if (
        firstChildNode.children &&
        Object.keys(firstChildNode.children).length > 0
      ) {
        inProgressNodes.push(firstChildNode as InProgressTrieNode);
      }
    }
  });

  return result;
};
