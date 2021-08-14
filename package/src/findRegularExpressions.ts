import * as CharacterRanges from "./characterRange";

type CharacterRange = CharacterRanges.CharacterRange;

const searchForRegularExpression = (
  text: string,
  regularExpression: string,
  result: CharacterRange[]
) => {
  const regex = new RegExp(regularExpression, "g");

  let match: RegExpExecArray | null = regex.exec(text);
  while (match !== null) {
    result.push(
      CharacterRanges.create({
        start: match.index,
        length: match[0].length,
      })
    );
    match = regex.exec(text);
  }

  return result;
};

export const findRegularExpressions = (  
  regularExpressions: string[],
  text: string
): CharacterRange[] => {
  const result: CharacterRange[] = [];
  if (regularExpressions) {
    regularExpressions.forEach((regularExpression) => {
      if (regularExpression) {
        searchForRegularExpression(text, regularExpression, result);
      }
    });
  }

  return result;
};