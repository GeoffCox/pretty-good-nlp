import {TokenRanges} from "../tokenRange";

describe("tokenRange", () => {
    describe("create", () => {
        it("creates instance of TokenRange", () => {
            const actual = TokenRanges.create({ start: 4, length: 5 });
            expect(actual).toBeDefined();
            expect(actual.kind).toEqual('tokenRange');
          });
    })   
});