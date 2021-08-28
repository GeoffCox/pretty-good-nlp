import type { CharacterRange } from "./characterRange";
import type { TokenMap } from "./tokenMap";
import { TokenMaps } from "./tokenMap";
import type { TrieNode } from "./trieSearch";
import { addTokensToTrieNode, trieSearch } from "./trieSearch";
import type { Tokenizer } from "./types";


export const findPhrases = (  
  phrases: string[],
  textTokenMap: TokenMap,
  tokenizer: Tokenizer
): CharacterRange[] => {  
  if (phrases) {
    const node : TrieNode = {};
    phrases.forEach((phrase) => {
      addTokensToTrieNode(TokenMaps.getTokens(tokenizer(phrase)), node);
    });
    const tokenRanges = trieSearch(TokenMaps.getTokens(textTokenMap), node);
    return tokenRanges.map((x) => TokenMaps.getCharacterRange(textTokenMap, x));
  }

  return [];
};
