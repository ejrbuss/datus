"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slog2 = (n) => n === 0 ? n : Math.log2(n);
const nanz = (n, alt = 0) => isNaN(n) ? alt : n;
const sum = (...ns) => ns.reduce((acc, n) => acc + n, 0);
const mul = (...ns) => ns.reduce((acc, n) => acc * n, 1);
const entropy = (...ps) => exports.Maths.sum(...ps.map(p => -p * exports.Maths.slog2(p)));
const sumOfSquares = (...ns) => exports.Maths.sum(...ns.map(n => n * n));
const magnitude = (ns) => exports.Maths.sqrt(exports.Maths.sumOfSquares(...ns));
const normalize = (ns) => ns.map(n => n / magnitude(ns));
const pnormalize = (ns) => ns.map(n => n / exports.Maths.sum(...ns));
exports.Maths = {
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
