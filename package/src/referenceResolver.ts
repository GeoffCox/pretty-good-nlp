import type { ExamplePart, Intent } from "./types";
import cloneDeep from "lodash/cloneDeep";

/**
 * @internal
 */
export const _resolveStringReferences = (
  items: string[],
  library: Record<string, string[]>
) => {
  const newItems: string[] = [];

  items.forEach((item) => {
    if (/^\$ref=.*/gim.test(item)) {
      const refName = item.substring(5).trim();
      if (library[refName]) {
        newItems.push(...library[refName]);
      } else {
        newItems.push(item);
      }
    } else {
      newItems.push(item);
    }
  });

  return newItems;
};

/**
 * @internal
 */
export const _resolvePartReferences = (
  part: ExamplePart,
  library: Record<string, string[]>
) => {
  if (part.phrases) {
    part.phrases = _resolveStringReferences(part.phrases, library);
  }
  if (part.patterns) {
    part.patterns = _resolveStringReferences(part.patterns, library);
  }
  if (part.regularExpressions) {
    part.regularExpressions = _resolveStringReferences(
      part.regularExpressions,
      library
    );
  }
};

/**
 * Returns a copy of an intent with references resolved across examples.
 * If a reference is not found in shared, then it remains in the example.
 */
export const resolveReferences = (
  intent: Intent,
  shared: Record<string, string[]>
): Intent => {  
  const result = cloneDeep<Intent>(intent);

  result.examples.forEach((example) => {
    example.parts.forEach((part) => {
      _resolvePartReferences(part, shared);
    });
    example.neverParts?.forEach((neverPart) => {
      _resolvePartReferences(neverPart, shared);
    });
  });

  return result;
};
