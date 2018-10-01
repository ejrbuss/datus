import { ID3 } from './ID3';
import { ARFF } from '../data/ARFF';
import { Relation } from '../data/relation';

const weather = ARFF.parseFile('./data/weather.nominal.arff');

test('ID3.selectAttribute', () => {
    const r = Relation.withoutAttr(weather, 'play');
    expect(ID3.selectAttribute(r, 'play')).toEqual('outlook');
});

test('ID3.splitAttribute', () => {
    const r = ID3.splitAttribute(weather, 'outlook', 'overcast');
    expect(r.rows.map(row => row['play'])).toMatchObject([
        'yes', 'yes', 'yes', 'yes',
    ]);
});

test('ID3.done', () => {
    expect(ID3.done(weather, 'play')).toBeFalsy();
    expect(ID3.done(ID3.splitAttribute(weather, 'outlook', 'overcast'), 'play')).toBeTruthy();
});

test('ID3.tree', () => {
    expect(ID3.tree(weather, 'play')).toMatchObject({
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