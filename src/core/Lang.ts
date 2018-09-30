import { last, flatten } from 'lodash';

export type LangAtom = string | number;
export interface LangList extends Array<Lang> {}
export interface LangFunc {
    name: string;
    args: LangList;
}
export type Lang = LangAtom 
    | LangList 
    | LangFunc
    ;

export type LangFuncDef = {
    min?: number;
    max?: number;
    numeric: false;
    fn: (args: LangList, self: LangFunc) => Lang;
    str?: (args: LangList, self: LangFunc) => string;
} | {
    min?: number;
    max?: number;
    numeric: true;
    fn: (args: number[], self: LangFunc) => Lang;
    str?: (args: LangList, self: LangFunc) => string;
};

export type LangEnv = { [name: string]: LangFuncDef | undefined };

const env: LangEnv = {};
const log: Lang[]  = [];
const sig: (lang: Lang) => string = JSON.stringify;

const isAtom = (lang: Lang) =>
    typeof lang === 'string' || typeof lang === 'number';

const isList = (lang: Lang) =>
    Array.isArray(lang);

const isFunc = (lang: Lang) =>
    typeof lang === 'object' && !Array.isArray(lang);

const matcher = <T>(
    atomMatcher: (atom: LangAtom) => T,
    listMatcher: (list: LangList) => T,
    funcMatcher: (func: LangFunc) => T,
): ((lang: Lang) => T) => lang => {
    if (Lang.isAtom(lang)) { return atomMatcher(lang as LangAtom) }
    if (Lang.isList(lang)) { return listMatcher(lang as LangList) }
    if (Lang.isFunc(lang)) { return funcMatcher(lang as LangFunc) }
    throw new Error(`Object cannot be matched: ${lang}`);
};

const str: (lang: Lang) => string = matcher(
    atom => typeof atom === 'number' ? atom.toFixed(2) : atom,
    list => `[${list.map(Lang.str).join(', ')}]`,
    func => {
        const { name, args } = func;
        const def = Lang.env[name];
        if (def && def.str) {
            return def.str(args, func);
        }
        return `${name}(${args.map(Lang.str).join(', ')})`;
    },
);

const eqstr = (steps: Lang[]): string =>
    steps.map((lang, i) => {
        if (i == 0) {
            return Lang.str(lang);
        } else {
            return ' = ' + Lang.str(lang);
        }
    }).join('\n');

const make = (name: LangAtom, ...args: Lang[]): LangFunc => ({
    name: name.toString(),
    args: args,
})

const invoke = (def: LangFuncDef, func: LangFunc): Lang => {
    let { name, args } = func;
    if (args.length === 1 && Array.isArray(args[0])) {
        args = flatten(args) as LangList;
    }
    if (def.min !== undefined && args.length < def.min) {
        throw new Error(`${name} expected at least ${def.min} arguments! Recieved: ${Lang.str(args)}`);
    }
    if (def.max !== undefined && args.length > def.max) {
        throw new Error(`${name} expected at most ${def.max} arguments! Recieved: ${Lang.str(args)}`);
    }
    if (!def.numeric) {
        return def.fn(args, func);
    }
    if (def.numeric && args.every(arg => typeof arg === 'number')) {
        return def.fn(args as number[], func);
    }
    return func;
}

const unwrap: (lang: Lang) => Lang = matcher(
    atom => {
        const def = Lang.env[atom];
        if (def) { return Lang.invoke(def, make(atom)); }
        else     { return atom; }
    },
    list => list.map(Lang.unwrap),
    func => {
        const { name, args } = func;
        const urgs = Lang.unwrap(args);
        const def  = Lang.env[name];
        if (Lang.sig(args) === Lang.sig(urgs) && def) { 
            return Lang.invoke(def, func); 
        } else {
            return Lang.make(name, ...(urgs as LangList));
        }
    },
);

const run = (lang: Lang, log: Lang[] = []): Lang => {
    log.push(lang);
    const unwrapped = Lang.unwrap(lang);
    if (Lang.sig(lang) !== Lang.sig(unwrapped)) {
        Lang.run(unwrapped, log);
    }
    Lang.log = log;
    return last(log) as Lang;
};

const $ = (fn: ($: any) => Lang) => {
    const magic = new Proxy({}, {
        get: (_, prop: string) =>
            (...args: Lang[]) => Lang.make(prop, ...args),
    })
    return Lang.run(fn(magic));
};

const binaryPrinter = (name: string): ((args: LangList, self: LangFunc) => string) =>
    (args, func) => {
        if (args.length === 2) {
            const [a, b] = args;
            const aStr = Lang.str(a);
            const bStr = Lang.str(b);
            const aBr  = Lang.isAtom(a);
            const bBr  = Lang.isAtom(b);
            return `${aBr ? aStr : `(${aStr})`} ${name} ${bBr ? bStr : `(${bStr})`}`;
        } else {
            return `${func.name}(${args.map(Lang.str).join(', ')})`;
        }
    };

const unaryPrinter = (name: string): ((args: LangList, self: LangFunc) => string) =>
    (args, func) => {
        if (args.length === 1) {
            const [a] = args;
            const aStr = Lang.str(a);
            const aBr  = Lang.isAtom(a);
            return `${name}${aBr ? aStr : `(${aStr})`}`;
        } else {
            return `${func.name}(${args.map(Lang.str).join(', ')})`;
        }
    };


export const Lang = {
    env,
    log,
    sig,
    isAtom,
    isList, 
    isFunc,
    matcher,
    str,
    eqstr,
    make,
    invoke,
    unwrap,
    run,
    $,
    binaryPrinter,
    unaryPrinter,
};