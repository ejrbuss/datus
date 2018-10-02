"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Count_1 = require("../core/Count");
const Maths_1 = require("../core/Maths");
const copy = (r, partial) => ({
    relation: partial.relation || r.relation,
    attrs: partial.attrs || r.attrs,
    rows: partial.rows || r.rows,
});
const withoutAttr = (r, ...attrs) => exports.Relation.copy(r, { attrs: r.attrs.filter(attr => !attrs.includes(attr)) });
const where = (r, condition) => typeof condition === 'function'
    ? exports.Relation.copy(r, { rows: r.rows.filter(condition) })
    : exports.Relation.where(r, row => Object.keys(condition).every(attr => row[attr] === condition[attr]));
const classes = (r, attr) => lodash_1.uniq(r.rows.map(row => row[attr]));
const countClasses = (r, attr) => r.rows.reduce((d, row) => (Object.assign({}, d, { [row[attr]]: (d[row[attr]] || 0) + 1 })), {});
const count = (r, attr) => Object.values(exports.Relation.countClasses(r, attr));
const counts = (r, attr, cls) => exports.Relation
    .classes(r, attr)
    .map(attrVal => exports.Relation.where(r, { [attr]: attrVal }))
    .map(nr => Object.values(exports.Relation.count(nr, cls)));
const entropies = (r, cls) => r.attrs.map(attr => Count_1.Count.info(...exports.Relation.counts(r, attr, cls)));
const probability = (r, pred, given) => given
    ? exports.Relation.probability(exports.Relation.where(r, given), pred)
    : exports.Relation.where(r, pred).rows.length /
        r.rows.length;
const laplaceProbability = (r, pred, given) => given
    ? exports.Relation.laplaceProbability(exports.Relation.where(r, given), pred)
    : (exports.Relation.where(r, pred).rows.length + 1) /
        (r.rows.length + Maths_1.Maths.sum(...Object.keys(pred).map(attr => exports.Relation.classes(r, attr).length)));
const orderedByOccurence = (r, attr) => lodash_1.sortBy(exports.Relation.classes(r, attr), attrVal => -exports.Relation.countClasses(r, attr)[attrVal]);
exports.Relation = {
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
