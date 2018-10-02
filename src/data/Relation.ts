import { uniq, sortBy } from 'lodash';
import { Count } from '../core/Count';
import { Maths } from '../core/Maths';

export type Value = string | number;

export type Row<T = Value> = { [attr: string]: T };

export type Relation = {
    relation: string;
    attrs:    string[];
    rows:     Row[];
}

const copy = (r: Relation, partial: Partial<Relation>): Relation => ({
    relation: partial.relation || r.relation,
    attrs:    partial.attrs    || r.attrs,
    rows:     partial.rows     || r.rows,
});

const withoutAttr = (r: Relation, ...attrs: string[]): Relation =>
    Relation.copy(r, { attrs: r.attrs.filter(attr => !attrs.includes(attr)) });

const where = (r: Relation, condition: ((row: Row) => boolean) | Partial<Row>): Relation =>
    typeof condition === 'function'
        ? Relation.copy(r, { rows: r.rows.filter(condition) })
        : Relation.where(r, row => Object.keys(condition).every(attr => row[attr] === condition[attr]));

const classes = (r: Relation, attr: string): Value[] =>
    uniq(r.rows.map(row => row[attr]));

const countClasses = (r: Relation, attr: string): { [attrVal: string]: number } => 
    r.rows.reduce((d: Row<number>, row) => ({ ...d, [row[attr]]: (d[row[attr]] || 0) + 1 }), {});

const count = (r: Relation, attr: string): Count =>
    Object.values(Relation.countClasses(r, attr));

const counts = (r: Relation, attr: string, cls: string): number[][] =>
    Relation
        .classes(r, attr)
        .map(attrVal => Relation.where(r, { [attr]: attrVal }))
        .map(nr => Object.values(Relation.count(nr, cls)));

const entropies = (r: Relation, cls: string): number[] =>
    r.attrs.map(attr => Count.info(...Relation.counts(r, attr, cls)));

const probability = (r: Relation, pred: Partial<Row>, given?: Partial<Row>): number =>
    given
        ? Relation.probability(Relation.where(r, given), pred)
        : Relation.where(r, pred).rows.length / 
            r.rows.length;

const laplaceProbability = (r: Relation, pred: Partial<Row>, given?: Partial<Row>): number =>
    given
        ? Relation.laplaceProbability(Relation.where(r, given), pred)
        : (Relation.where(r, pred).rows.length + 1) / 
            (r.rows.length + Maths.sum(...Object.keys(pred).map(attr => Relation.classes(r, attr).length)));

const orderedByOccurence = (r: Relation, attr: string): Value[] =>
    sortBy(Relation.classes(r, attr), attrVal => -Relation.countClasses(r, attr)[attrVal]);

export const Relation = {
    copy,
    withoutAttr,
    where,
    classes,
    countClasses,
    count,
    counts,
    entropies,
    probability,
    laplaceProbability,
    orderedByOccurence,
};

