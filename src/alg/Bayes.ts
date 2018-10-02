import { Row, Relation } from '../data/relation';
import { DecisionTree, Decision } from './DecisionTree';
import { Maths } from '../core/Maths';

const numerator = (r: Relation, pred: Partial<Row>, given: Partial<Row>, laplace: boolean): number =>
    Relation.probability(r, pred) * 
        Maths.mul(...Object.keys(given).map(attr => laplace
            ? Relation.laplaceProbability(r, { [attr]: given[attr] }, pred)
            : Relation.probability(r, { [attr]: given[attr] }, pred)
        ));

const tree = (r: Relation, e: Partial<Row>, cls: string, laplace: boolean = true): DecisionTree => {
    const clss = Relation.classes(r, cls);
    const ns = clss.map(clsVal => Bayes.numerator(r, { [cls]: clsVal }, e, laplace));
    const ps = Maths.pnormalize(ns);
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
    tree,
};