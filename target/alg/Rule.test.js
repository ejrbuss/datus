"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = require("./Rule");
const ARFF_1 = require("../data/ARFF");
const lenses = ARFF_1.ARFF.parseFile('./data/contact-lenses.arff');
test('Rule.withCondition', () => {
    const rule = { clsVal: 'none', conditions: [
            { attr: 'age', attrVal: 'young' },
        ], };
    expect(Rule_1.Rule.withCondition(rule, { attr: 'astigmatism', attrVal: 'no' })).toMatchObject({
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    });
});
test('Rule.applyRule', () => {
    const row = lenses.rows[0];
    expect(Rule_1.Rule.applyRule(row, {
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    })).toBeTruthy();
    expect(Rule_1.Rule.applyRule(row, {
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'yes' },
        ],
    })).toBeFalsy();
});
test('Rule.satisfyRule', () => {
    const row = lenses.rows[0];
    expect(Rule_1.Rule.satisfyRule(row, {
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    }, 'contact-lenses')).toBeTruthy();
    expect(Rule_1.Rule.satisfyRule(row, {
        clsVal: 'soft',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    }, 'contact-lenses')).toBeFalsy();
});
test('Rule.relevant', () => {
    expect(Rule_1.Rule.relevant(lenses, {
        clsVal: 'soft',
        conditions: [{ attr: 'age', attrVal: 'young' }],
    }).rows.length).toEqual(8);
});
test('Rule.irrelevant', () => {
    expect(Rule_1.Rule.irrelevant(lenses, {
        clsVal: 'soft',
        conditions: [{ attr: 'age', attrVal: 'young' }],
    }).rows.length).toEqual(16);
});
test('Rule.coverage', () => {
    expect(Rule_1.Rule.coverage(lenses, {
        clsVal: 'soft',
        conditions: [{ attr: 'age', attrVal: 'young' }],
    })).toEqual(8 / 24);
    expect(Rule_1.Rule.coverage(lenses, {
        clsVal: 'soft',
        conditions: [{ attr: 'age', attrVal: 'pre-presbyopic' }],
    })).toEqual(8 / 24);
    expect(Rule_1.Rule.coverage(lenses, {
        clsVal: 'soft',
        conditions: [{ attr: 'age', attrVal: 'presbyopic' }],
    })).toEqual(8 / 24);
});
test('Rule.accuracy', () => {
    expect(Rule_1.Rule.accuracy(lenses, {
        clsVal: 'hard',
        conditions: [{ attr: 'age', attrVal: 'young' }],
    }, 'contact-lenses')).toEqual(2 / 8);
    expect(Rule_1.Rule.accuracy(lenses, {
        clsVal: 'hard',
        conditions: [{ attr: 'age', attrVal: 'pre-presbyopic' }],
    }, 'contact-lenses')).toEqual(1 / 8);
    expect(Rule_1.Rule.accuracy(lenses, {
        clsVal: 'hard',
        conditions: [{ attr: 'age', attrVal: 'presbyopic' }],
    }, 'contact-lenses')).toEqual(1 / 8);
});
test('Rule.conditions', () => {
    expect(Rule_1.Rule.conditions(lenses).length).toEqual(12);
});
