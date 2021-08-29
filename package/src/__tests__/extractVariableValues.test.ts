import { CharacterRanges } from "../characterRange";

import { extractVariableValues } from "../extractVariableValues";

const testText = "The quick brown fox jumps over the lazy dog.";

describe("extractVariableValues", () => {
  it("returns values when variables match", () => {
    const example = {
      parts: [
        {
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
        },
        {
          matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          variable: "subject",
        },
        {
          matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
        },
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog.
          variable: "directObject",
        },
      ],
    };
    const actual = extractVariableValues(testText, example);
    expect(actual).toBeDefined();
    expect(Object.keys(actual).length).toEqual(2);
    expect(actual.subject).toEqual(["brown fox"]);
    expect(actual.directObject).toEqual(["the lazy dog."]);
  });
  it("returns values in order when variables match multiple times", () => {
    const example = {
      parts: [
        {
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
        },
        {
          matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
          variable: "subject",
        },
        {
          matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
        },
        {
          matches: [
            CharacterRanges.create({ start: 31, length: 13 }), //the lazy dog.
            CharacterRanges.create({ start: 35, length: 8 }), //lazy dog
          ], //the lazy dog
          variable: "directObject",
        },
      ],
    };
    const actual = extractVariableValues(testText, example);
    expect(actual).toBeDefined();
    expect(Object.keys(actual).length).toEqual(2);
    expect(actual.subject).toEqual(["brown fox"]);
    expect(actual.directObject).toEqual(["the lazy dog.", "lazy dog"]);
  });
  it("returns no value when variable defined but no matches", () => {
    const example = {
      parts: [
        {
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
        },
        {
          matches: [],
          variable: "subject",
        },
        {
          matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
        },
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog.
          variable: "directObject",
        },
      ],
    };
    const actual = extractVariableValues(testText, example);
    expect(actual).toBeDefined();
    expect(Object.keys(actual).length).toEqual(1);
    expect(actual.directObject).toEqual(["the lazy dog."]);
  });
  it("returns empty when matches and no variables defined", () => {
    const example = {
      parts: [
        {
          matches: [CharacterRanges.create({ start: 0, length: 9 })], //The quick
        },
        {
          matches: [CharacterRanges.create({ start: 10, length: 9 })], //brown fox
        },
        {
          matches: [CharacterRanges.create({ start: 20, length: 10 })], //jumps over
        },
        {
          matches: [CharacterRanges.create({ start: 31, length: 13 })], //the lazy dog.
        },
      ],
    };
    const actual = extractVariableValues(testText, example);
    expect(actual).toBeDefined();
    expect(actual).toEqual({});
  });
  it("returns empty when no parts", () => {
    const example = {
      parts: [],
    };
    const actual = extractVariableValues(testText, example);
    expect(actual).toBeDefined();
    expect(actual).toEqual({});
  });
});
