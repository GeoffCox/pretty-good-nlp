export type TextRange = {
  kind: string;
  start: number;
  length: number;
  end: number;
};

/**
 * Returns a formatted string of the [start..end](length)kind.
 */
export const toString = <T extends TextRange>(range: Partial<T>): string => {
  const startText = range?.start ?? "";
  const endText = range?.end ?? "";
  const lengthText = range?.length ?? "";
  const kindText = range.kind ? ` kind:${range.kind}` : "";
  return `[${startText}..${endText}](${lengthText})${kindText}`;
};

/**
 * Creates a range from a partial range.
 * Range.kind defaults to the generic 'textRange' if not specified.
 */
export const create = <T extends TextRange>(range: Partial<T>): T => {
  const { kind = "textRange", start, end, length } = range;

  if (start !== undefined) {
    if (start < 0) {
      throw new Error(`The range start is negative. ${toString(range)}`);
    }
  }

  if (end !== undefined && end < 0) {
    throw new Error(`The range end is negative. ${toString(range)}`);
  }

  if (length !== undefined && length < 0) {
    throw new Error(`The range length is negative. ${toString(range)}`);
  }

  if (start !== undefined && end !== undefined && start > end) {
    throw new Error(`The range start is greater than end. ${toString(range)}`);
  }

  if (
    start !== undefined &&
    end !== undefined &&
    length !== undefined &&
    length !== end - start
  ) {
    throw new Error(
      `The range length doesn't equal end minus start. ${toString(range)}`
    );
  }

  if (start !== undefined && end !== undefined && length !== undefined) {
    // start, end, length
    return {
      kind,
      start,
      end,
      length,
    } as T;
  } else if (start !== undefined && end !== undefined) {
    // start, end
    return {
      kind,
      start,
      end,
      length: end - start,
    } as T;
  } else if (start !== undefined && length !== undefined) {
    // start, length
    return {
      kind,
      start,
      end: start + length,
      length,
    } as T;
  } else if (start !== undefined) {
    // start
    return {
      kind,
      start,
      end: start,
      length: 0,
    } as T;
  } else if (end !== undefined && length !== undefined) {
    // end, length
    return {
      kind,
      start: end - length,
      end,
      length,
    } as T;
  } else if (end !== undefined) {
    // end
    return {
      kind,
      start: end,
      end,
      length: 0,
    } as T;
  } else if (length !== undefined) {
    // length
    return {
      kind,
      start: 0,
      end: length,
      length,
    } as T;
  }

  // (empty)
  return {
    kind,
    start: 0,
    end: 0,
    length: 0,
  } as T;
};

/**
 * Returns true if the range is valid; false otherwise.
 */
export const isValid = <T extends TextRange>(range: T): boolean => {
  if (range === undefined) {
    return false;
  }

  const { kind, start, end, length } = range;

  return (
    kind !== undefined &&
    start !== undefined &&
    end !== undefined &&
    length !== undefined &&
    start >= 0 &&
    end >= 0 &&
    length >= 0 &&
    start <= end &&
    length === end - start
  );
};

/**
 * Validates the range is valid and throws errors if not.
 */
export const validate = <T extends TextRange>(range: T) => {
  if (range === undefined) {
    throw new Error(`The range is undefined. ${toString(range)}`);
  }
  const { kind, start, end, length } = range;

  if (kind === undefined) {
    throw new Error(`The range kind is undefined. ${toString(range)}`);
  }
  if (start === undefined) {
    throw new Error(`The range start is undefined. ${toString(range)}`);
  }
  if (end === undefined) {
    throw new Error(`The range end is undefined. ${toString(range)}`);
  }
  if (length === undefined) {
    throw new Error(`The range length is undefined. ${toString(range)}`);
  }
  if (start < 0) {
    throw new Error(`The range start is negative. ${toString(range)}`);
  }
  if (end < 0) {
    throw new Error(`The range end is negative. ${toString(range)}`);
  }
  if (length < 0) {
    throw new Error(`The range length is negative. ${toString(range)}`);
  }

  if (length !== end - start) {
    throw new Error(
      `The range length doesn't equal end minus start. ${toString(range)}`
    );
  }  
};

/**
 * Returns true if the two ranges are deeply equal; false otherwise. 
 */
export const equals = <T extends TextRange>(x: T, y: T): boolean => {
  validate(x);
  validate(y);
  return (
    x.kind === y.kind &&
    x.start === y.start &&
    x.end === y.end &&
    x.length === y.length
  );
};

/**
 * Returns true if the first range contains the other range; false otherwise. 
 */
export const contains = <T extends TextRange>(range: T, other: T): boolean => {
  validate(range);
  validate(other);
  return range.start <= other.start && range.end >= other.end;
};

/**
 * Returns true if the two ranges overlap; false otherwise. 
 */
export const overlaps = <T extends TextRange>(x: T, y: T): boolean => {
  validate(x);
  validate(y);
  // a single length range has start of N and end of N+1 so I use < and >
  return x.end > y.start && x.start < y.end;
};
