import { TokenMap } from "./tokenMap";
import { CharacterRange, CharacterRanges } from "./characterRange";

const delimiters = [" ", ".", ",", ":", ";"];

export const tokenize = (text: string): TokenMap => {
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
