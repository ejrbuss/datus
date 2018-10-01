import { Maths } from './Maths';

export type Count = number[];

const total = (...cs: Count[]): number =>
    Maths.sum(...cs.map(c => Maths.sum(...c)));

const probability = (c: Count) =>
    c.map(n => n / Count.total(c));

const info = (...cs: Count[]) =>
    Maths.sum(...cs.map(c => 
        Maths.entropy(...Count.probability(c)) * Count.total(c) / Count.total(...cs)
    ));

export const Count = {
    total,
    probability,
    info,
};