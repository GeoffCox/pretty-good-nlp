import type { TokenMap } from "./tokenMap";
import type { CharacterRange } from "./characterRange";
import { CharacterRanges } from "./characterRange";

const delimiters = [
  // punctuation
  " ",
  ".",
  ",",
  ":",
  ";",
  "?",
  "!",
  // grouping
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "<",
  ">",
  // separators
  "\\",
  "|",
  "/",
];

/**
 * Tokenizes text using delimiters:
 * - space
 * - period `.`
 * - comma `,`
 * - colon `:`
 * - semi-colon `;`
 * - question mark `?`
 * - exclamation point `!`
 * - parenthesis `(` `)`
 * - brackets `[` `]`
 * - curly brackets `{` `}`
 * - angle brackets `<` `>`
 * - vertical separator `|`
 * - back slash `\` 
 * - forward slash `/` 
 */
export const basicTokenize = (text: string): TokenMap => {
  if (!text || text.trim().length === 0) {
    return {
      text: "",
      characterRanges: [],
    };
  }

  const characterRanges: CharacterRange[] = [];
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (delimiters.includes(text[i])) {
      if (start >= 0) {
        characterRanges.push(
          CharacterRanges.create({
            start,
            end: i,
          })
        );
      }
      start = -1;
    } else if (start == -1) {
      start = i;
    }
  }

  if (start >= 0) {
    characterRanges.push(
      CharacterRanges.create({
        start,
        end: text.length,
      })
    );
  }

  return { characterRanges, text };
};
