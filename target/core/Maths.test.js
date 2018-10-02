"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = require("./Maths");
test('Maths.nanz', () => {
    expect(Maths_1.Maths.nanz(4)).toEqual(4);
    expect(Maths_1.Maths.nanz(NaN)).toEqual(0);
    expect(Maths_1.Maths.nanz(NaN, 4)).toEqual(4);
});
test('Maths.slog2', () => {
    expect(Maths_1.Maths.slog2(2)).toEqual(Math.log2(2));
    expect(Maths_1.Maths.slog2(0)).toEqual(0);
});
test('Maths.sum', () => {
    expect(Maths_1.Maths.sum()).toEqual(0);
    expect(Maths_1.Maths.sum(1, 2, 3, 4)).toEqual(10);
});
test('Maths.mul', () => {
    expect(Maths_1.Maths.mul()).toEqual(1);
    expect(Maths_1.Maths.mul(1, 2, 3, 4)).toEqual(24);
});
test('Maths.entropy', () => {
    expect(Maths_1.Maths.entropy(0, 1)).toEqual(0);
    expect(Maths_1.Maths.entropy(.5, .5)).toEqual(1);
    expect(Maths_1.Maths.entropy(.5, .25, .125, .125)).toEqual(1.75);
});
test('Maths.sumOfSquares', () => {
    expect(Maths_1.Maths.sumOfSquares(1, 2, 3, 4)).toEqual(30);
});
test('Maths.magnitude', () => {
    expect(Maths_1.Maths.magnitude([1, 2, 3, 4])).toEqual(Maths_1.Maths.sqrt(30));
});
test('Maths.normalize', () => {
    expect(Maths_1.Maths.normalize([42, 0, 0])).toMatchObject([1, 0, 0]);
});
test('Maths.pnormalize', () => {
    expect(Maths_1.Maths.pnormalize([1, 1, 2, 4])).toMatchObject([1 / 8, 1 / 8, 2 / 8, 4 / 8]);
});
