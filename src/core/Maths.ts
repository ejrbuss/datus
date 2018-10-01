const slog2 = (n: number) =>
    n === 0 ? n : Math.log2(n);

const nanz = (n: number, alt: number = 0) =>
    isNaN(n) ? alt : n;

const sum = (...ns: number[]) =>
    ns.reduce((acc, n) => acc + n, 0);

const entropy = (...ps: number[]): number =>
    Maths.sum(...ps.map(p => -p * Maths.slog2(p)));

const sumOfSquares = (...ns: number[]): number =>
    Maths.sum(...ns.map(n => n * n));

const magnitude = (ns: number[]): number =>
    Maths.sqrt(Maths.sumOfSquares(...ns));

const normalize = (ns: number[]): number[] => 
    ns.map(n => n / magnitude(ns));

export const Maths = {
    min: Math.min,
    sqrt: Math.sqrt,
    nanz,
    slog2,
    sum,
    entropy,
    sumOfSquares,
    magnitude,
    normalize,
};