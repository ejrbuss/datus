import { Rule } from './Rule';
import { ARFF } from '../data/ARFF';

const lenses = ARFF.parseFile('./data/contact-lenses.arff');

test('Rule.withCondition', () => {
    const rule = { clsVal: 'none', conditions: [
        { attr: 'age', attrVal: 'young' },
    ], };
    expect(Rule.withCondition(rule, { attr: 'astigmatism', attrVal: 'no' })).toMatchObject({
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    });
});

test('Rule.applyRule', () => {
    const row = lenses.rows[0];
    expect(Rule.applyRule(row, {
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    })).toBeTruthy();
    expect(Rule.applyRule(row, {
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'yes' },
        ],
    })).toBeFalsy();
});

test('Rule.satisfyRule', () => {
    const row = lenses.rows[0];
    expect(Rule.satisfyRule(row, {
        clsVal: 'none',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    }, 'contact-lenses')).toBeTruthy();
    expect(Rule.satisfyRule(row, {
        clsVal: 'soft',
        conditions: [
            { attr: 'age', attrVal: 'young' },
            { attr: 'astigmatism', attrVal: 'no' },
        ],
    }, 'contact-lenses')).toBeFalsy();
});

test('Rule.relevant', () => {
    expect(Rule.relevant(lenses, {
        clsVal: 'soft',
        conditions: [ { attr: 'age', attrVal: 'young' } ],
    }).rows.length).toEqual(8);
});

test('Rule.irrelevant', () => {
    expect(Rule.irrelevant(lenses, {
        clsVal: 'soft',
        conditions: [ { attr: 'age', attrVal: 'young' } ],
    }).rows.length).toEqual(16);
});

test('Rule.coverage', () => {
    expect(Rule.coverage(lenses, {
        clsVal: 'soft',
        conditions: [ { attr: 'age', attrVal: 'young' } ],
    })).toEqual(8 / 24);
    expect(Rule.coverage(lenses, {
        clsVal: 'soft',
        conditions: [ { attr: 'age', attrVal: 'pre-presbyopic' } ],
    })).toEqual(8 / 24);
    expect(Rule.coverage(lenses, {
        clsVal: 'soft',
        conditions: [ { attr: 'age', attrVal: 'presbyopic' } ],
    })).toEqual(8 / 24);
});

test('Rule.accuracy', () => {
    expect(Rule.accuracy(lenses, {
        clsVal: 'hard',
        conditions: [ { attr: 'age', attrVal: 'young' } ],
    }, 'contact-lenses')).toEqual(2 / 8);
    expect(Rule.accuracy(lenses, {
        clsVal: 'hard',
        conditions: [ { attr: 'age', attrVal: 'pre-presbyopic' } ],
    }, 'contact-lenses')).toEqual(1 / 8);
    expect(Rule.accuracy(lenses, {
        clsVal: 'hard',
        conditions: [ { attr: 'age', attrVal: 'presbyopic' } ],
    }, 'contact-lenses')).toEqual(1 / 8);
});

test('Rule.conditions', () => {
    expect(Rule.conditions(lenses).length).toEqual(12);
});