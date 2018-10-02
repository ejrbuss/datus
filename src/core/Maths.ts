const slog2 = (n: number) =>
    n === 0 ? n : Math.log2(n);

const nanz = (n: number, alt: number = 0) =>
    isNaN(n) ? alt : n;

const sum = (...ns: number[]) =>
    ns.reduce((acc, n) => acc + n, 0);

const mul = (...ns: number[]) =>
    ns.reduce((acc, n) => acc * n, 1);

const entropy = (...ps: number[]): number =>
    Maths.sum(...ps.map(p => -p * Maths.slog2(p)));

const sumOfSquares = (...ns: number[]): number =>
    Maths.sum(...ns.map(n => n * n));

const magnitude = (ns: number[]): number =>
    Maths.sqrt(Maths.sumOfSquares(...ns));

const normalize = (ns: number[]): number[] => 
    ns.map(n => n / magnitude(ns));

const pnormalize = (ns: number[]): number[] =>
    ns.map(n => n / Maths.sum(...ns));

export const Maths = {
    min: Math.min,
    max: Math.max,
    sqrt: Math.sqrt,
    log: Math.log,
    nanz,
    slog2,
    sum,
    mul,
    entropy,
    sumOfSquares,
    magnitude,
    normalize,
    pnormalize,
};