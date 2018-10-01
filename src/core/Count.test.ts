import { Count } from './Count';

test('Count.total', () => {
    expect(Count.total([4, 4])).toEqual(8);
    expect(Count.total([9, 3], [1, 2, 3, 4])).toEqual(22);
});

test('Count.probability', () => {
    expect(Count.probability([4, 4])).toMatchObject([.5, .5]);
});

test('Count.info', () => {
    expect(Count.info([2, 3])).toBeCloseTo(.971);
    expect(Count.info([4, 0])).toBeCloseTo(0);
    expect(Count.info([3, 2])).toBeCloseTo(.971);
    expect(Count.info([2, 3], [4, 0], [3, 2])).toBeCloseTo(.693);
    expect(Count.info([2, 2])).toBeCloseTo(1);
    expect(Count.info([4, 2])).toBeCloseTo(.918);
    expect(Count.info([3, 1])).toBeCloseTo(.811);
    expect(Count.info([2, 2], [4, 2], [3, 1])).toBeCloseTo(.911);
    expect(Count.info([3, 4])).toBeCloseTo(.985);
    expect(Count.info([6, 1])).toBeCloseTo(.592);
    expect(Count.info([3, 4], [6, 1])).toBeCloseTo(.788);
    expect(Count.info([6, 2])).toBeCloseTo(.811);
    expect(Count.info([3, 3])).toBeCloseTo(1);
    expect(Count.info([6, 2], [3, 3])).toBeCloseTo(.892);
});