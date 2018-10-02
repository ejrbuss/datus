"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = require("./Rule");
const relation_1 = require("../data/relation");
const lodash_1 = require("lodash");
const done = (r, cls, clsVal) => !r.rows.some(row => row[cls] === clsVal);
const conditionWeights = (r, rule, cls) => Rule_1.Rule.conditions(r).map(condition => ({
    condition,
    pt: Rule_1.Rule.accuracy(r, Rule_1.Rule.withCondition(rule, condition), cls),
    t: Rule_1.Rule.relevant(r, Rule_1.Rule.withCondition(rule, condition)).rows.length,
}));
const selectCondition = (r, rule, cls) => lodash_1.orderBy(conditionWeights(r, rule, cls), ['pt', 't'], ['desc', 'desc'])[0].condition;
const selectRule = (r, rule, cls) => {
    if (Rule_1.Rule.accuracy(r, rule, cls) !== 1 && r.attrs.length) {
        const condition = exports.Prism.selectCondition(r, rule, cls);
        return selectRule(relation_1.Relation.withoutAttr(r, condition.attr), Rule_1.Rule.withCondition(rule, condition), cls);
    }
    return rule;
};
const selectRules = (r, cls, clsVal, rules) => {
    if (!exports.Prism.done(r, cls, clsVal)) {
        const rule = exports.Prism.selectRule(r, { clsVal, conditions: [] }, cls);
        return exports.Prism.selectRules(Rule_1.Rule.irrelevant(r, rule), cls, clsVal, [...rules, rule]);
    }
    return rules;
};
const rules = (r, cls) => lodash_1.flatten(relation_1.Relation
    .orderedByOccurence(r, cls)
    .reverse()
    .map(clsVal => exports.Prism.selectRules(relation_1.Relation.withoutAttr(r, cls), cls, clsVal, [])));
exports.Prism = {
    done,
    conditionWeights,
    selectCondition,
    selectRule,
    selectRules,
    rules,
};
