import {CharacterRange, CharacterRanges} from "../characterRange";
import { createMatchSort } from "../matchSort";


describe('basicMatchSort module', () => {
    describe('createBasicMatchSort', () => {
        it('sorts defined matches earlier', () => {
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

            const sort = createMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('sorts new matches earlier', () => {

            // create a range 11..15 that overlaps with 10..15
            const ranges : CharacterRange[] = [                
                CharacterRanges.create({ start: 11, length: 4}),
            ];

            const sort = createMatchSort();
            sort(ranges); 
            
            const expected : CharacterRange[] = [
                CharacterRanges.create({ start: 17, length: 3}),
                CharacterRanges.create({ start: 30, length: 9}),                
                CharacterRanges.create({ start: 10, length: 5}),                
            ];

            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 10, length: 5}),
                CharacterRanges.create({ start: 17, length: 3}),                
                CharacterRanges.create({ start: 30, length: 9}),
            ];                        
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('sorts after previous match earlier', () => {
            
            // create a range 11..15 that is after 5..8
            const ranges : CharacterRange[] = [                
                CharacterRanges.create({ start: 11, length: 4}),
            ];

            const sort = createMatchSort();
            sort(ranges);

            const expected : CharacterRange[] = [
                CharacterRanges.create({ start: 16, length: 2}),
                CharacterRanges.create({ start: 20, length: 2}),   
                CharacterRanges.create({ start: 5, length: 3}),                                               
            ];

            // To test the statement in matchSort.ts - xAfterLastMatch ? -1 : 1;
            // xAfterLastMatch is false when comparing (5..8,16..18) or (5..8,20..22)
            // xAfterLastMatch is true when comparing (16..18, 5..8)  or (20..22, 5..8)            
            // We need the following ordering to force the compare to cover both cases
            const actual : CharacterRange[] = [
                CharacterRanges.create({ start: 20, length: 2}),   
                CharacterRanges.create({ start: 5, length: 3}),                                
                CharacterRanges.create({ start: 16, length: 2}),                
            ];          
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('sorts earlier start match earlier', () => {
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

            const sort = createMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('sorts longer earlier', () => {
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

            const sort = createMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('no-op when matches undefined', () => {
            const expected = undefined as unknown as CharacterRange[];
            const actual = undefined as unknown as CharacterRange[];

            const sort = createMatchSort();
            sort(actual);
            expect(actual).toEqual(expected);
        });
        it('no-op when matches empty', () => {
            const expected : CharacterRange[] = [];
            const actual : CharacterRange[] = [];

            const sort = createMatchSort();
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

            const sort = createMatchSort();
            sort(ranges1);
            sort(ranges2);
            sort(ranges3);            
            sort(actual);
            expect(actual).toEqual(expected);
        });
    });
});