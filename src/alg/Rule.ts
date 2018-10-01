import { Value, Relation, Row } from '../data/relation';
import { flatten } from 'lodash';
import { Maths } from '../core/Maths';

export type RuleCondition = {
    attr: string;
    attrVal: Value;
};

export type Rule = {
    conditions: RuleCondition[];
    clsVal: Value;
};

const withCondition = (rule: Rule, condition: RuleCondition): Rule =>
    ({ ...rule, conditions: [ ...rule.conditions, condition ]});

const applyRule = (row: Row, rule: Rule): boolean =>
    rule.conditions.every(({ attr, attrVal }) => row[attr] === attrVal);

const satisfyRule = (row: Row, rule: Rule, cls: string): boolean =>
    applyRule(row, rule) && row[cls] === rule.clsVal;

const relevant = (r: Relation, rule: Rule): Relation =>
    Relation.copy(r, { rows: r.rows.filter(row => applyRule(row, rule)) });

const irrelevant = (r: Relation, rule: Rule): Relation =>
    Relation.copy(r, { rows: r.rows.filter(row => !applyRule(row, rule)) });

const coverage = (r: Relation, rule: Rule): number =>
    Rule.relevant(r, rule).rows.length / 
        r.rows.length;

const accuracy = (r: Relation, rule: Rule, cls: string): number =>
    Maths.nanz(Rule.relevant(r, rule).rows.filter(row => Rule.satisfyRule(row, rule, cls)).length / 
        Rule.relevant(r, rule).rows.length
    );

const conditions = (r: Relation): RuleCondition[] =>
    flatten(r.attrs.map(attr => Relation.classes(r, attr).map(attrVal => ({ attr, attrVal }))));

export const Rule = {
    withCondition,
    applyRule,
    satisfyRule,
    relevant,
    irrelevant,
    coverage,
    accuracy,
    conditions,
};