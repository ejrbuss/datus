import { Prism } from './Prism';
import { ARFF } from '../data/ARFF';
import { Rule } from './Rule';
import { Relation } from '../data/relation';

const lenses = ARFF.parseFile('./data/contact-lenses.arff');

test('Prism.done', () => {
    expect(Prism.done(lenses, 'contact-lenses', 'none')).toBeFalsy();
    expect(Prism.done(lenses, 'contact-lenses', 'n/a')).toBeTruthy();
});

test('Prism.conditionWeights', () => {
    expect(Prism.conditionWeights(
        lenses, 
        { clsVal: 'hard', conditions: [] }, 
        'contact-lenses',
    ).map(w => w.pt)).toMatchObject([
        2 / 8,
        1 / 8,
        1 / 8,
        3 / 12,
        1 / 12,
        0 / 12,
        4 / 12,
        0 / 12,
        4 / 12,
        0 / 24,
        0 / 24,
        24 / 24,
    ]);
});

test('Prism.selectCondition', () => {
    const r = Relation.withoutAttr(lenses, 'contact-lenses');
    expect(Prism.selectCondition(r, { clsVal: 'hard', conditions: [] }, 'contact-lenses')).toMatchObject({
        attr: 'astigmatism', attrVal: 'yes',
    });
});

test('Prism.selectRule', () => {
    const r = Relation.withoutAttr(lenses, 'contact-lenses');
    expect(Prism.selectRule(r, { clsVal: 'hard', conditions: [] }, 'contact-lenses')).toMatchObject({
        clsVal: 'hard',
        conditions: [
            { attr: 'astigmatism', attrVal: 'yes' },
            { attr: 'tear-prod-rate', attrVal: 'normal' },
            { attr: 'spectacle-prescrip', attrVal: 'myope' },
        ],
    });
});

test('Prism.selectRules', () => {
    const r = Relation.withoutAttr(lenses, 'contact-lenses');
    expect(Prism.selectRules(r, 'contact-lenses', 'hard', [])).toMatchObject([
        {
            clsVal: 'hard',
            conditions: [
                { attr: 'astigmatism', attrVal: 'yes' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
                { attr: 'spectacle-prescrip', attrVal: 'myope' },
            ],
        },
        {
            clsVal: 'hard',
            conditions: [
                { attr: 'age', attrVal: 'young' },
                { attr: 'astigmatism', attrVal: 'yes' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
            ],
        }
    ]);
});

test('Prism.rules', () => {
    expect(Prism.rules(lenses, 'contact-lenses')).toMatchObject([
        {
            clsVal: 'hard',
            conditions: [
                { attr: 'astigmatism', attrVal: 'yes' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
                { attr: 'spectacle-prescrip', attrVal: 'myope' },
            ]
        },
        {
            clsVal: 'hard',
            conditions: [
                { attr: 'age', attrVal: 'young' },
                { attr: 'astigmatism', attrVal: 'yes' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
            ]
        },
        {
            clsVal: 'soft',
            conditions: [
                { attr: 'astigmatism', attrVal: 'no' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
                { attr: 'spectacle-prescrip', attrVal: 'hypermetrope' },
            ]
        },
        {
            clsVal: 'soft',
            conditions: [
                { attr: 'astigmatism', attrVal: 'no' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
                { attr: 'age', attrVal: 'young' },
            ]
        },
        {
            clsVal: 'soft',
            conditions: [
                { attr: 'age', attrVal: 'pre-presbyopic' },
                { attr: 'astigmatism', attrVal: 'no' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
            ]
        },
        {
            clsVal: 'none',
            conditions: [
                { attr: 'tear-prod-rate', attrVal: 'reduced' },
            ]
        },
        {
            clsVal: 'none',
            conditions: [
                { attr: 'age', attrVal: 'presbyopic' },
                { attr: 'tear-prod-rate', attrVal: 'normal' },
                { attr: 'spectacle-prescrip', attrVal: 'myope' },
                { attr: 'astigmatism', attrVal: 'no' },
            ]
        },
        {
            clsVal: 'none',
            conditions: [
                { attr: 'spectacle-prescrip', attrVal: 'hypermetrope' },
                { attr: 'astigmatism', attrVal: 'yes' },
                { attr: 'age', attrVal: 'pre-presbyopic' },
            ]
        },
        {
            clsVal: 'none',
            conditions: [
                { attr: 'age', attrVal: 'presbyopic' },
                { attr: 'spectacle-prescrip', attrVal: 'hypermetrope' },
                { attr: 'astigmatism', attrVal: 'yes' },
            ]
        }
    ]);
});