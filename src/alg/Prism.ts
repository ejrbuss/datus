import { Rule, RuleCondition } from './Rule';
import { Relation, Value } from '../data/relation';
import { orderBy, flatten } from 'lodash';

export type RuleConditionWeight = {
    condition: RuleCondition;
    pt: number;
    t: number;
};

const done = (r: Relation, cls: string, clsVal: Value): boolean =>
    !r.rows.some(row => row[cls] === clsVal);

const conditionWeights = (r: Relation, rule: Rule, cls: string): RuleConditionWeight[] =>
    Rule.conditions(r).map(condition => ({
        condition, 
        pt: Rule.accuracy(r, Rule.withCondition(rule, condition), cls),
        t: Rule.relevant(r, Rule.withCondition(rule, condition)).rows.length,
    }));

const selectCondition = (r: Relation, rule: Rule, cls: string): RuleCondition =>
    orderBy(conditionWeights(r, rule, cls), ['pt', 't'], ['desc', 'desc'])[0].condition;

const selectRule = (r: Relation, rule: Rule, cls: string): Rule => {
    if (Rule.accuracy(r, rule, cls) !== 1 && r.attrs.length) {
        const condition = Prism.selectCondition(r, rule, cls);
        return selectRule(
            Relation.withoutAttr(r, condition.attr), 
            Rule.withCondition(rule, condition), 
            cls,
        );
    }
    return rule;
};

const selectRules = (r: Relation, cls: string, clsVal: Value, rules: Rule[]): Rule[] => {
    if (!Prism.done(r, cls, clsVal)) {
        const rule = Prism.selectRule(r, { clsVal, conditions: [] }, cls);
        return Prism.selectRules(
            Rule.irrelevant(r, rule),
            cls,
            clsVal,
            [...rules, rule],
        );
    }
    return rules;
};

const rules = (r: Relation, cls: string): Rule[] =>
    flatten(Relation
        .orderedByOccurence(r, cls)
        .reverse()
        .map(clsVal => 
            Prism.selectRules(Relation.withoutAttr(r, cls), cls, clsVal, [])
    ));

export const Prism = {
    done,
    conditionWeights,
    selectCondition,
    selectRule,
    selectRules,
    rules,
};