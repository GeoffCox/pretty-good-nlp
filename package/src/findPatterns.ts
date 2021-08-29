import type { CharacterRange } from "./characterRange";
import { _findRegularExpressions } from "./findRegularExpressions";

/**
 * @internal
 */
export const _patternToRegularExpression = (pattern: string) => {
  if (!pattern) {
    throw new Error("The pattern is undefined, null, or empty.");
  }
  const result: string[] = [];

  let isInEscape = false;
  for (let i = 0; i < pattern.length; i++) {
    const character = pattern[i];

    if (isInEscape) {
      result.push(`\\${character}`);
      isInEscape = false;
      continue;
    }

    switch (character) {
      // \ escape
      case "\\":
        isInEscape = true;
        break;
      // # => any single digit
      case "#":
        result.push("\\d");
        break;
      // @ => any single letter
      case "@":
        result.push("[a-zA-Z]");
        break;
      // $ => any word character (i.e. letter or number)
      case "$":
        result.push("\\w");
        break;
      // ! => any non-word characters (i.e. punctuation)
      case "!":
        result.push("\\W");
        break;
      // * => zero or more word characters (i.e. letters or numbers)
      case "*":
        result.push("\\w*");
        break;
      // regex meta characters
      case "^":
      case "(":
      case ")":
      case "+":
      case "[":
      case "]":
      case "{":
      case "}":
      case "|":
      case ".":
      case "?":
        result.push(`\\${character}`);
        break;
      default:
        result.push(character);
        break;
    }
  }

  return result.join("");
};

/**
 * @internal
 */
export const findPatterns = (
  patterns: string[],
  text: string
): CharacterRange[] => {
  return patterns
    ? _findRegularExpressions(patterns.map(_patternToRegularExpression), text)
    : [];
};
