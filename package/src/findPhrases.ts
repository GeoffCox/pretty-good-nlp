import * as TokenMaps from "./tokenMap";
import { TokenMap } from "./tokenMap";
import { addTokensToTrieNode, TrieNode, trieSearch } from "./trieSearch";
import { Tokenizer } from "./types";
import { CharacterRange } from "./characterRange";

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
