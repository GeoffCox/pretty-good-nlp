import type {
  CharacterRange,
  ExamplePartRecognition,
  ExampleRecognition,
} from "@geoffcox/pretty-good-nlp";

import orderBy from "lodash/orderBy";

/**
 * Gets the line segments (as CSS styles) for matches and never matches with offset to avoid overlap.
 */ 
export const getLabelLines = (
  exampleRecognition: ExampleRecognition,
  characterWidth: number,
  lineHeight: number,
  lineGap: number
): { segments: string[]; lineCount: number } => {
  let ranges = [];

  exampleRecognition.neverParts?.forEach((neverPart) => {
    neverPart.matches?.forEach((neverMatch) => {
      ranges.push({
        ...neverMatch,
        isBestMatch: false,
        isNeverMatch: true,
      });
    });
  });

  exampleRecognition.parts?.forEach((part) => {
    part.matches?.forEach((match, i) => {
      ranges.push({
        ...match,
        isBestMatch: i === 0,
        isNeverMatch: false,
      });
    });
  });

  ranges = orderBy(ranges, ["isNeverMatch", "isSecondary"], ["desc", "asc"]);

  // the layout moves segments down to avoid overlap with any previous segments
  const segments = [];
  const prevRanges = [];
  let lastEnd = -1;
  let lineCount = 0;
  ranges.forEach((range) => {
    const lineIndex = prevRanges.filter(
      (prev) => prev.end > range.start && prev.start < range.end
    ).length;
    prevRanges.push(range);
    lastEnd = Math.max(lastEnd, range.end);
    lineCount = Math.max(lineCount, lineIndex);

    segments.push(
      `--line-left:${range.start * characterWidth}px;` +
        `--line-top:${lineIndex * (lineGap + lineHeight)}px;` +
        `--line-width:${range.length * characterWidth}px;` +
        `--line-height: ${lineHeight}px;` +
        `--line-color: ${
          range.isNeverMatch
            ? "darkRed"
            : range.isBestMatch
            ? "darkGreen"
            : "gray"
        }`
    );
  });

  return {
    segments,
    lineCount,
  };
};
