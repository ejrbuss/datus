import { Relation, Value } from '../data/relation';
import { Maths } from '../core/Maths';
import { DecisionTree, Decision } from './DecisionTree';

const selectAttribute = (r: Relation, cls: string): string => {
    const entropies = Relation.entropies(r, cls);
    const lowest    = Maths.min(...entropies);
    return r.attrs[entropies.indexOf(lowest)];
};

const splitAttribute = (r: Relation, attr: string, val: Value): Relation =>
    Relation.where(r, { [attr]: val });

const done = (r: Relation, cls: string): boolean =>
    Relation.count(r, cls).length <= 1;

const tree = (r: Relation, cls: string): DecisionTree | Decision => {
    r = Relation.withoutAttr(r, cls);
    if (!ID3.done(r, cls)) {
        const attr = ID3.selectAttribute(r, cls);
        const children = Relation.classes(r, attr).reduce((children, val) => ({
            ...children, [val]: tree(ID3.splitAttribute(r, attr, val), cls),
        }), {});
        return { attr, children };
    }
    return { clsVal: r.rows[0][cls], probability: 1 };
};

export const ID3 = {
    selectAttribute,
    splitAttribute,
    done,
    tree,
};