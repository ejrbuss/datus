import { uniq } from 'lodash';
import { Count } from '../core/Count';

export type Value = string | number;

export type Row = { [attr: string]: Value };

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

const where = (r: Relation, condition: (row: Row) => boolean): Relation =>
    copy(r, { rows: r.rows.filter(condition) });

const classes = (r: Relation, attr: string): Value[] =>
    uniq(r.rows.map(row => row[r.attrs.indexOf(attr)]));

const count = (r: Relation, attr: string): Count =>
    r.rows.reduce((count: Count, row) => ({ ...count, [row[attr]]: (count[row[attr]] || 0) + 1 }), {});

const counts = (r: Relation, attr: string, cls: string): number[][] =>
    Relation
        .classes(r, attr)
        .map(attrVal => Relation.where(r, row => row[attr] === attrVal))
        .map(nr => Object.values(Relation.count(nr, cls)));

export const Relation = {
    where,
    classes,
    copy,
    count,
    counts,
};

