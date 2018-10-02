import { Maths } from './Maths';

test('Maths.nanz', () => {
    expect(Maths.nanz(4)).toEqual(4);
    expect(Maths.nanz(NaN)).toEqual(0);
    expect(Maths.nanz(NaN, 4)).toEqual(4);
});

test('Maths.slog2', () => {
    expect(Maths.slog2(2)).toEqual(Math.log2(2));
    expect(Maths.slog2(0)).toEqual(0);
});

test('Maths.sum', () => {
    expect(Maths.sum()).toEqual(0);
    expect(Maths.sum(1, 2, 3, 4)).toEqual(10);
});

test('Maths.mul', () => {
    expect(Maths.mul()).toEqual(1);
    expect(Maths.mul(1, 2, 3, 4)).toEqual(24);
});

test('Maths.entropy', () => {
    expect(Maths.entropy(0, 1)).toEqual(0);
    expect(Maths.entropy(.5, .5)).toEqual(1);
    expect(Maths.entropy(.5, .25, .125, .125)).toEqual(1.75);
});

test('Maths.sumOfSquares', () => {
    expect(Maths.sumOfSquares(1, 2, 3, 4)).toEqual(30);
});

test('Maths.magnitude', () => {
    expect(Maths.magnitude([1, 2, 3, 4])).toEqual(Maths.sqrt(30));
});

test('Maths.normalize', () => {
    expect(Maths.normalize([42, 0, 0])).toMatchObject([1, 0, 0]);
});

test('Maths.pnormalize', () => {
    expect(Maths.pnormalize([1, 1, 2, 4])).toMatchObject([1 / 8, 1 / 8, 2 / 8, 4 / 8]);
});