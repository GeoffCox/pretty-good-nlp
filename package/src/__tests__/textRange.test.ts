import {TextRange, TextRanges} from "../textRange";

describe("textRange module", () => {
  describe("create", () => {
    it.each([
      // empty
      [{}, { kind: "textRange", start: 0, end: 0, length: 0 }],
      // kind
      [
        { kind: "customRange" },
        { kind: "customRange", start: 0, end: 0, length: 0 },
      ],
      // start
      [{ start: 5 }, { kind: "textRange", start: 5, end: 5, length: 0 }],
      // end
      [{ end: 5 }, { kind: "textRange", start: 5, end: 5, length: 0 }],
      // start, end
      [
        { start: 2, end: 7 },
        { kind: "textRange", start: 2, end: 7, length: 5 },
      ],
      // length
      [{ length: 5 }, { kind: "textRange", start: 0, end: 5, length: 5 }],
      // start, length
      [
        { start: 2, length: 5 },
        { kind: "textRange", start: 2, end: 7, length: 5 },
      ],
      // end, length
      [
        { end: 7, length: 5 },
        { kind: "textRange", start: 2, end: 7, length: 5 },
      ],
      // start, end, length
      [
        { start: 2, end: 7, length: 5 },
        { kind: "textRange", start: 2, end: 7, length: 5 },
      ],
      // kind, start, end, length
      [
        { kind: "customRange", start: 2, end: 7, length: 5 },
        { kind: "customRange", start: 2, end: 7, length: 5 },
      ],
    ])("creates instance for %o", (input, expected) => {
      const actual = TextRanges.create(input);
      expect(actual).toBeDefined();
      expect(actual.kind).toEqual(expected.kind);
      expect(actual.start).toEqual(expected.start);
      expect(actual.end).toEqual(expected.end);
      expect(actual.length).toEqual(expected.length);
    });
    it.each([
      // negative start
      [{ start: -5 }],
      // negative end
      [{ end: -5 }],
      // negative length
      [{ length: -5 }],
      // start > end
      [{ start: 7, end: 5 }],
      // length !== end - start
      [{ start: 5, end: 7, length: 4 }],
    ])("throws for %o", (input) => {
      expect(() => TextRanges.create(input)).toThrowError();
    });
  });
  describe("isValid", () => {
    it.each([
      // undefined
      [undefined, false],
      // empty
      [{}, false],
      // kind
      [{ kind: "customRange" }, false],
      // start
      [{ start: 5 }, false],
      // end
      [{ end: 5 }, false],
      // start, end
      [{ start: 2, end: 7 }, false],
      // length
      [{ length: 5 }, false],
      // start, length
      [{ start: 2, length: 5 }, false],
      // end, length
      [{ end: 7, length: 5 }, false],
      // kind, start
      [{ kind: "textRange", start: 5 }, false],
      // kind, end
      [{ kind: "textRange", end: 5 }, false],
      // kind, start, end
      [{ kind: "textRange", start: 2, end: 7 }, false],
      // kind, length
      [{ kind: "textRange", length: 5 }, false],
      // kind, start, length
      [{ kind: "textRange", start: 2, length: 5 }, false],
      // kind, end, length
      [{ kind: "textRange", end: 7, length: 5 }, false],
      // kind, start, end, length
      [{ kind: "textRange", start: 2, end: 7, length: 5 }, true],
      // kind, start, end, length
      [{ kind: "customRange", start: 2, end: 7, length: 5 }, true],
    ])("creates instance for %o", (input, expected) => {
      const actual = TextRanges.isValid(input as TextRange);
      expect(actual).toEqual(expected);
    });
  });
  describe("validate", () => {
    it.each([
      // undefined
      [undefined],
      // empty
      [{}],
      // no kind
      [{ start: 2, end: 5, length: 3 }],
      // no start
      [{ kind: "textRange", end: 5, length: 3 }],
      // no end
      [{ kind: "textRange", start: 2, length: 3 }],
      // no length
      [{ kind: "textRange", start: 2, end: 5 }],
      // start negative
      [{ kind: "textRange", start: -4, end: 5, length: 3 }],
      // end negative
      [{ kind: "textRange", start: 2, end: -5, length: 3 }],
      // length negative
      [{ kind: "textRange", start: 2, end: 5, length: -3 }],
      // length incorrect
      [{ kind: "textRange", start: 2, end: 5, length: 4 }],
    ])("throws for %o", (input) => {
      expect(() => TextRanges.validate(input as TextRange)).toThrow();
    });
    
    it("accepts valid range", () => {
      const range = TextRanges.create({ start: 2, end: 5 });
      TextRanges.validate(range);
    });
  });
  describe("equals", () => {
    it.each([
      // both empty
      [true, {}, {}],
      // equal
      [true, { start: 3, end: 5 }, { start: 3, length: 2 }],
      // kind different
      [false, { kind: "a", start: 2, end: 5 }, { kind: "b", start: 2, end: 5 }],
      // start different
      [false, { start: 2, end: 5 }, { start: 3, end: 5 }],
      // end different
      [false, { start: 2, end: 5 }, { start: 2, end: 4 }],
      // length different
      [false, { start: 2, length: 5 }, { start: 2, length: 6 }],
    ])("returns %p for %o and %o", (expected, a, b) => {
      const rangeA = TextRanges.create(a);
      const rangeB = TextRanges.create(b);
      const actual = TextRanges.equals(rangeA, rangeB);
      expect(actual).toEqual(expected);
    });
    it("throws if first param is invalid", () => {
      const rangeA = { kind: "textRange", start: 7, end: 4 } as TextRange;
      const rangeB = TextRanges.create({ start: 4, end: 6 });
      expect(() => TextRanges.equals(rangeA, rangeB)).toThrow();
    });
    it("throws if second param is invalid", () => {
      const rangeA = TextRanges.create({ start: 4, end: 6 });
      const rangeB = { kind: "textRange", start: 7, end: 4 } as TextRange;
      expect(() => TextRanges.equals(rangeA, rangeB)).toThrow();
    });
  });
  describe("overlaps", () => {
    it("returns true if starts overlap", () => {
      const rangeA = TextRanges.create({ start: 2, end: 6 });
      const rangeB = TextRanges.create({ start: 4, end: 6 });
      expect(TextRanges.overlaps(rangeA, rangeB)).toEqual(true);
    });
    it("returns true if ends ovelap", () => {
      const rangeA = TextRanges.create({ start: 2, end: 8 });
      const rangeB = TextRanges.create({ start: 2, end: 5 });
      expect(TextRanges.overlaps(rangeA, rangeB)).toEqual(true);
    });
    it("returns true if end ovelaps start", () => {
      const rangeA = TextRanges.create({ start: 2, end: 8 });
      const rangeB = TextRanges.create({ start: 7, end: 10 });
      expect(TextRanges.overlaps(rangeA, rangeB)).toEqual(true);
    });
    it("returns true if equal", () => {
      const rangeA = TextRanges.create({ start: 2, end: 6 });
      const rangeB = TextRanges.create({ start: 2, end: 6 });
      expect(TextRanges.overlaps(rangeA, rangeB)).toEqual(true);
    });
    it("returns false if abutted", () => {
      const rangeA = TextRanges.create({ start: 2, end: 6 });
      const rangeB = TextRanges.create({ start: 6, end: 10 });
      expect(TextRanges.overlaps(rangeA, rangeB)).toEqual(false);
    });
    it("returns false if no overlap", () => {
      const rangeA = TextRanges.create({ start: 7, end: 10 });
      const rangeB = TextRanges.create({ start: 1, end: 6 });
      expect(TextRanges.overlaps(rangeA, rangeB)).toEqual(false);
    });
    it("throws if first param is invalid", () => {
      const rangeA = { kind: "textRange", start: 7, end: 4 } as TextRange;
      const rangeB = TextRanges.create({ start: 4, end: 6 });
      expect(() => TextRanges.overlaps(rangeA, rangeB)).toThrow();
    });
    it("throws if second param is invalid", () => {
      const rangeA = TextRanges.create({ start: 4, end: 6 });
      const rangeB = { kind: "textRange", start: 7, end: 4 } as TextRange;
      expect(() => TextRanges.overlaps(rangeA, rangeB)).toThrow();
    });
  });
  describe("contains", () => {
    it("returns true if first contains second", () => {
      const rangeA = TextRanges.create({ start: 0, end: 10 });
      const rangeB = TextRanges.create({ start: 4, end: 6 });
      expect(TextRanges.contains(rangeA, rangeB)).toEqual(true);
    });
    it("returns true if equal", () => {
      const rangeA = TextRanges.create({ start: 2, end: 7 });
      const rangeB = TextRanges.create({ start: 2, end: 7 });
      expect(TextRanges.contains(rangeA, rangeB)).toEqual(true);
    });
    it("returns false if second contains first", () => {
      const rangeA = TextRanges.create({ start: 2, end: 7 });
      const rangeB = TextRanges.create({ start: 1, end: 10 });
      expect(TextRanges.contains(rangeA, rangeB)).toEqual(false);
    });
    it("throws if first param is invalid", () => {
      const rangeA = { kind: "textRange", start: 7, end: 4 } as TextRange;
      const rangeB = TextRanges.create({ start: 4, end: 6 });
      expect(() => TextRanges.contains(rangeA, rangeB)).toThrow();
    });
    it("throws if second param is invalid", () => {
      const rangeA = TextRanges.create({ start: 4, end: 6 });
      const rangeB = { kind: "textRange", start: 7, end: 4 } as TextRange;
      expect(() => TextRanges.contains(rangeA, rangeB)).toThrow();
    });
  });
  describe("toString", () => {
    it.each([
      [{ }, "[..]()"],
      [{ kind: "textRange"}, "[..]() kind:textRange"],
      [{ start: 4 }, "[4..]()"],
      [{ end: 11 }, "[..11]()"],
      [{ length: 7 }, "[..](7)"],
      [{ start: 4, end: 11 }, "[4..11]()"],
      [{ start: 4, length: 7 }, "[4..](7)"],
      [{ end: 11, length: 7 }, "[..11](7)"],
      [{ start: 4, end: 11, length: 7 }, "[4..11](7)"],
      [{ kind: "textRange", start: 4 }, "[4..]() kind:textRange"],
      [{ kind: "textRange", end: 11 }, "[..11]() kind:textRange"],
      [{ kind: "textRange", length: 7 }, "[..](7) kind:textRange"],
      [{ kind: "textRange", start: 4, end: 11 }, "[4..11]() kind:textRange"],
      [{ kind: "textRange", start: 4, length: 7 }, "[4..](7) kind:textRange"],
      [{ kind: "textRange", end: 11, length: 7 }, "[..11](7) kind:textRange"],
      [{ kind: "textRange", start: 4, end: 11, length: 7 }, "[4..11](7) kind:textRange"],
    ])('provides string for %o', (range, expected) => {
      expect(TextRanges.toString(range)).toEqual(expected);
    });
  });
});
