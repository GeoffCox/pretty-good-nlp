import * as CharacterRanges from "../characterRange";
import { createBasicMatchSort } from "../basicMatchSort";

type CharacterRange = CharacterRanges.CharacterRange;

describe('basicMatchSort module', () => {
    describe('createBasicMatchSort', () => {
        it('orders defined matches earlier', () => {
            const expected : CharacterRange[] = [
                CharacterRanges.create({ start: 10, length: 5}),
                CharacterRanges.create({ start: 17, length: 3}),                
                undefined as unknown as CharacterRange,
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 17, length: 3}),
                undefined as unknown as CharacterRange,
                CharacterRanges.create({ start: 10, length: 5}),
            ];

            const sort = createBasicMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('orders new matches earlier', () => {
            const expected : CharacterRange[] = [
                CharacterRanges.create({ start: 17, length: 3}),
                CharacterRanges.create({ start: 30, length: 9}),                
                CharacterRanges.create({ start: 10, length: 5}),                
            ];

            const ranges : CharacterRange[] = [                
                CharacterRanges.create({ start: 11, length: 4}),
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 10, length: 5}),
                CharacterRanges.create({ start: 17, length: 3}),                
                CharacterRanges.create({ start: 30, length: 9}),
            ];

            const sort = createBasicMatchSort();
            sort(ranges);
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('orders after previous match earlier', () => {
            const expected : CharacterRange[] = [
                CharacterRanges.create({ start: 16, length: 2}),
                CharacterRanges.create({ start: 5, length: 3}),                                               
            ];

            const ranges : CharacterRange[] = [                
                CharacterRanges.create({ start: 11, length: 4}),
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 5, length: 3}),                
                CharacterRanges.create({ start: 16, length: 2}),                
            ];

            const sort = createBasicMatchSort();
            sort(ranges);
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('orders earlier start match earlier', () => {
            const expected : CharacterRange[] = [                            
                CharacterRanges.create({ start: 5, length: 5}),                
                CharacterRanges.create({ start: 6, length: 5}),                                                             
                CharacterRanges.create({ start: 7, length: 5}),    
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 7, length: 5}),                
                CharacterRanges.create({ start: 5, length: 5}),                
                CharacterRanges.create({ start: 6, length: 5}),                
            ];

            const sort = createBasicMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('orders longer earlier', () => {
            const expected : CharacterRange[] = [                            
                CharacterRanges.create({ start: 5, length: 7}),                
                CharacterRanges.create({ start: 5, length: 6}),                                                             
                CharacterRanges.create({ start: 5, length: 5}),    
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 5, length: 5}),                
                CharacterRanges.create({ start: 5, length: 6}),                
                CharacterRanges.create({ start: 5, length: 7}),                
            ];

            const sort = createBasicMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('no-op when matches undefined', () => {
            const expected = undefined as unknown as CharacterRange[];
            const actual = undefined as unknown as CharacterRange[];

            const sort = createBasicMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('no-op when matches empty', () => {
            const expected : CharacterRange[] = [];
            const actual : CharacterRange[] = [];

            const sort = createBasicMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('orders matches for multiple sort calls', () => {
            const expected : CharacterRange[] = [                
                CharacterRanges.create({ start: 10, length: 5}),                                
                CharacterRanges.create({ start: 5, length: 5}), 
                CharacterRanges.create({ start: 20, length: 7}),                                                
                CharacterRanges.create({ start: 20, length: 5}), 
            ];

            const ranges1 : CharacterRange[] = [
                CharacterRanges.create({ start: 5, length: 3}),                               
            ];

            const ranges2 : CharacterRange[] = [
                CharacterRanges.create({ start: 18, length: 5}),                               
            ];

            const ranges3 : CharacterRange[] = [
                undefined as unknown as CharacterRange,                              
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 10, length: 5}),
                CharacterRanges.create({ start: 5, length: 5}), 
                CharacterRanges.create({ start: 20, length: 5}),                
                CharacterRanges.create({ start: 20, length: 7}),   
            ];

            const sort = createBasicMatchSort();
            sort(ranges1);
            sort(ranges2);
            sort(ranges3);
            sort(actual);
            expect(actual).toEqual(expected);
        });
    });
});