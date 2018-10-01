import { Row, Relation } from '../data/relation';
import { DecisionTree, Decision } from './DecisionTree';
import { Maths } from '../core/Maths';

const numerator = (r: Relation, pred: Partial<Row>, given: Partial<Row>): number =>
    Maths.sum(...Object.keys(given).map(attr => Relation.probability(r, { [attr]: given[attr] }, pred)));

const decision = (r: Relation, e: Partial<Row>, cls: string): DecisionTree => {
    const clss = Relation.classes(r, cls);
    const ns = clss.map(clsVal => Bayes.numerator(r, { [cls]: clsVal }, e));
    const ps = Maths.normalize(ns);
    return {
        attr: cls,
        children: clss.reduce((d: DecisionTree['children'], clsVal, i) => {
            d[clsVal] = { clsVal: clsVal, probability: ps[i] }
            return d;
        }, {}),
    };
};

export const Bayes = {
    numerator,
    decision,
};