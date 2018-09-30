import { Maths } from './Maths';
import { Lang } from './Lang';

Lang.env = { ...Lang.env, ...Maths.env };

test('Maths.slog2', () => {
    expect(Lang.$($ => $.slog2(2))).toEqual(Math.log2(2));
    expect(Lang.$($ => $.slog2(0))).toEqual(0);
});

test('Maths.sum', () => {
    expect(Lang.$($ => $.sum())).toEqual(0);
    expect(Lang.$($ => $.sum(1, 2, 3, 4))).toEqual(10);
    expect(Lang.$($ => $.sum([1, 2, 3, 4]))).toEqual(10);    
});

test('Maths.entropy', () => {
    expect(Lang.$($ => $.entropy(0, 1))).toEqual(0);
    expect(Lang.$($ => $.entropy(.5, .5))).toEqual(1);
    expect(Lang.$($ => $.entropy(.5, .25, .125, .125))).toEqual(1.75);
});