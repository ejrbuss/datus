import { Lang, LangEnv } from './Lang';

const env: LangEnv = {
    neg: {
        min: 1,
        max: 1,
        numeric: true,
        fn: ([n]) => -n,
        str: Lang.unaryPrinter('-'),
    },
    sum: {
        numeric: true,
        fn: ns => ns.reduce((acc, n) => acc + n, 0),
        str: Lang.binaryPrinter('+'),
    },
    mul: {
        numeric: true,
        fn: ns => ns.reduce((acc, n) => acc * n, 1),
        str: Lang.binaryPrinter('*'),
    },
    div: {
        min: 2,
        max: 2,
        numeric: true,
        fn: ([a, b]) => a / b,
        str: Lang.binaryPrinter('/'),
    },
    slog2: {
        min: 1,
        max: 1,
        numeric: true,
        fn: ([n]) => n === 0 ? n : Math.log2(n),
    },
    entropy: {
        numeric: false,
        fn: ps => Lang.make('sum', ...ps.map(p => Lang.make('mul', Lang.make('neg', p), Lang.make('slog2', p)))),
    }
};

export const Maths = { 
    env 
};