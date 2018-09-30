import { Maths } from './Maths';
import { mapValues } from 'lodash';

export type Count = { [attrVal: string]: number };

const make = (...ns: number[]): Count =>
    ns.reduce((c: Count, n, i) => ({ ...c, [i]: n }), {});

const total = (c: Count | Count[]): number =>
    Array.isArray(c)
        ? Maths.sum(c.map(total))
        : Maths.sum(Object.values(c));

const probability = (c: Count) =>
    mapValues(c, n => n / Count.total(c));

export const Count = {
    make,
    probability,
    total,
};