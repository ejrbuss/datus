"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ID3_1 = require("./ID3");
const ARFF_1 = require("../data/ARFF");
const relation_1 = require("../data/relation");
const weather = ARFF_1.ARFF.parseFile('./data/weather.nominal.arff');
test('ID3.selectAttribute', () => {
    const r = relation_1.Relation.withoutAttr(weather, 'play');
    expect(ID3_1.ID3.selectAttribute(r, 'play')).toEqual('outlook');
});
test('ID3.splitAttribute', () => {
    const r = ID3_1.ID3.splitAttribute(weather, 'outlook', 'overcast');
    expect(r.rows.map(row => row['play'])).toMatchObject([
        'yes', 'yes', 'yes', 'yes',
    ]);
});
test('ID3.done', () => {
    expect(ID3_1.ID3.done(weather, 'play')).toBeFalsy();
    expect(ID3_1.ID3.done(ID3_1.ID3.splitAttribute(weather, 'outlook', 'overcast'), 'play')).toBeTruthy();
});
test('ID3.tree', () => {
    expect(ID3_1.ID3.tree(weather, 'play')).toMatchObject({
        attr: 'outlook',
        children: {
            sunny: {
                attr: 'humidity',
                children: {
                    high: { clsVal: 'no' },
                    normal: { clsVal: 'yes' },
                },
            },
            overcast: { clsVal: 'yes' },
            rainy: {
                attr: 'windy',
                children: {
                    TRUE: { clsVal: 'no' },
                    FALSE: { clsVal: 'yes' },
                },
            },
        },
    });
});
