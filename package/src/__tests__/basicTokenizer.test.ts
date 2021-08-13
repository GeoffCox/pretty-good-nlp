import { tokenize } from "../basicTokenizer";

describe("basicTokenizer module", () => {
  describe("tokenize", () => {
    it("returns tokens", () => {
      const text = "The quick brown fox jumped over the lazy dog";
      const actual = tokenize(text);

      expect(actual).toBeDefined();
      expect(actual.text).toEqual(text);
      expect(actual.characterRanges).toBeDefined();
      expect(actual.characterRanges.length).toEqual(9);
    });
    it("returns tokens if ends in delimiter", () => {
      const text = "he quick brown fox jumped over the lazy dog.";
      const actual = tokenize(text);

      expect(actual).toBeDefined();
      expect(actual.text).toEqual(text);
      expect(actual.characterRanges).toBeDefined();
      expect(actual.characterRanges.length).toEqual(9);
    });
    it("returns tokens for text with delimiters", () => {
        const text = "The. quick, brown fox jump:ed over the la;zy dog";
        const actual = tokenize(text);
  
        expect(actual).toBeDefined();
        expect(actual.text).toEqual(text);
        expect(actual.characterRanges).toBeDefined();
        expect(actual.characterRanges.length).toEqual(11);
      });
    it("returns empty for undefined", () => {
      const actual = tokenize(undefined as unknown as string);

      expect(actual).toBeDefined();
      expect(actual.text).toEqual("");
      expect(actual.characterRanges).toBeDefined();
      expect(actual.characterRanges.length).toEqual(0);
    });
    it("returns empty for empty string", () => {
        const actual = tokenize("");
    
        expect(actual).toBeDefined();
        expect(actual.text).toEqual("");
        expect(actual.characterRanges).toBeDefined();
        expect(actual.characterRanges.length).toEqual(0);
      });
      it("returns empty for all whitespace", () => {
        const actual = tokenize("       ");
    
        expect(actual).toBeDefined();
        expect(actual.text).toEqual("");
        expect(actual.characterRanges).toBeDefined();
        expect(actual.characterRanges.length).toEqual(0);
      });
  });
 
});
