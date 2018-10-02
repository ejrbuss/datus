"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relation_1 = require("../data/relation");
const lodash_1 = require("lodash");
const Maths_1 = require("../core/Maths");
const withCondition = (rule, condition) => (Object.assign({}, rule, { conditions: [...rule.conditions, condition] }));
const applyRule = (row, rule) => rule.conditions.every(({ attr, attrVal }) => row[attr] === attrVal);
const satisfyRule = (row, rule, cls) => applyRule(row, rule) && row[cls] === rule.clsVal;
const relevant = (r, rule) => relation_1.Relation.copy(r, { rows: r.rows.filter(row => applyRule(row, rule)) });
const irrelevant = (r, rule) => relation_1.Relation.copy(r, { rows: r.rows.filter(row => !applyRule(row, rule)) });
const coverage = (r, rule) => exports.Rule.relevant(r, rule).rows.length /
    r.rows.length;
const accuracy = (r, rule, cls) => Maths_1.Maths.nanz(exports.Rule.relevant(r, rule).rows.filter(row => exports.Rule.satisfyRule(row, rule, cls)).length /
    exports.Rule.relevant(r, rule).rows.length);
const conditions = (r) => lodash_1.flatten(r.attrs.map(attr => relation_1.Relation.classes(r, attr).map(attrVal => ({ attr, attrVal }))));
exports.Rule = {
    withCondition,
    applyRule,
    satisfyRule,
    relevant,
    irrelevant,
    coverage,
    accuracy,
    conditions,
};
