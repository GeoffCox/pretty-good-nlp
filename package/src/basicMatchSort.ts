import { CharacterRange, CharacterRanges} from "./characterRange";

/**
 * Provides a sort method to order matches for an example part from best to worst.
 * @description
 * ## Stateful sort
 * The sort method is expected to be repeatedly called for the matches of examples parts for a single example.
 * This means the result of each sort call is based on previous calls.
 *
 * Imagine a travel example: `I want to travel from Seattle to Portland`
 *
 * - Both the origin and destination example parts will match both Seattle and Portland.
 * - The example has the origin city before the destination city.
 * - The match order for origin should be Seattle then Portland.
 * - The match order destination should be Portland then Seattle.
 *
 * ## The sort comparison prefers:
 * 1. new matches (no overlap with previous matches)
 * 2. after last part's best match
 * 3. earlier start of match
 * 4. longer match
 */
export const createBasicMatchSort = () => {
  let lastBestMatchEnd = -1;
  const allMatches: CharacterRange[] = [];

  const compare = (x: CharacterRange, y: CharacterRange) => {
    const xNewMatch = allMatches.every((m) => !CharacterRanges.overlaps(x, m));
    const yNewMatch = allMatches.every((m) => !CharacterRanges.overlaps(y, m));

    if (xNewMatch == yNewMatch) {
      const xAfterLastMatch = x.start >= lastBestMatchEnd;
      const yAfterLastMatch = y.start >= lastBestMatchEnd;

      if (xAfterLastMatch == yAfterLastMatch) {
        if (x.start == y.start) {
          // longer ordered earlier
          return y.length - x.length;
        }

        // earlier start ordered earlier
        return x.start - y.start;
      }

      // after last match ordered earlier
      return xAfterLastMatch ? -1 : 1;
    }

    // new matched ordered earlier
    return xNewMatch ? -1 : 1;
  };

  return (matches: CharacterRange[]) => {
    if (!matches || matches.length == 0) {
      return;
    }

    matches.sort(compare);
    lastBestMatchEnd = matches[0]?.end ?? lastBestMatchEnd;
    allMatches.push(...matches.filter(Boolean));
  };
};
