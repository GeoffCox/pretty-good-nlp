import { ExamplePart, Intent } from "./types";
import { cloneDeep } from "lodash";

const resolveReferences = (items: string[], library: Record<string, string[]>) => {
  const newItems: string[] = [];

  items.forEach((item) => {
    if (/^\$ref=.*/gim.test(item)) {
      const refName = item.substring(5).trim();
      if (library[refName]) {
        newItems.push(...library[refName]);
      }
    } else {
      newItems.push(item);
    }
  });

  return newItems;
};

const replacePartReferences = (part: ExamplePart, library: Record<string, string[]>) =>{
  if (part.phrases) {
    part.phrases = resolveReferences(part.phrases, library);
  }
  if (part.patterns) {
    part.patterns = resolveReferences(part.patterns, library);
  }
  if (part.regularExpressions) {
    part.regularExpressions = resolveReferences(part.regularExpressions, library);
  }
}

export const resolveIntentReferences = (intent: Intent, library: Record<string, string[]>) : Intent => {
  const result = cloneDeep<Intent>(intent);

  result.examples?.forEach((example) => {
    example.parts?.forEach((part) => {
      replacePartReferences(part, library);
    });
    example.neverParts?.forEach((neverPart) => {
      replacePartReferences(neverPart, library);
    });
  });

  return result;
}
