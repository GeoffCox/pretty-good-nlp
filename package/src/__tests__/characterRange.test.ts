import {CharacterRanges} from "../characterRange";

describe("characterRange", () => {
    describe("create", () => {
        it("creates instance of CharacterRange", () => {
            const actual = CharacterRanges.create({ start: 4, length: 5 });
            expect(actual).toBeDefined();
            expect(actual.kind).toEqual('characterRange');
          });
    }),
    describe("validate", () => {
        it("accepts valid range for text", () => {
            const range = CharacterRanges.create({ start: 4, length: 5 });
            CharacterRanges.validate(range, "The quick brown fox");
          });
          it("accepts valid range without text", () => {
            const range = CharacterRanges.create({ start: 10, length: 15 });
            CharacterRanges.validate(range);
          });
        it.each([[{ start: 25, length: 3 }], [{ start: 10, length: 15 }]])(
            "throws if outside text",
            (input) => {
              const range = CharacterRanges.create(input);
              expect(() =>
              CharacterRanges.validate(range, "The quick brown fox")
              ).toThrow();
            }
          );
    });
});