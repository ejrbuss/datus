import { Relation } from './Relation';
import { ARFF } from './ARFF';

const weather = ARFF.parseFile('./data/weather.nominal.arff');

test('Relation.copy', () => {
    const copy = Relation.copy(weather, { rows: [] });
    expect(weather.rows.length).toBeGreaterThan(0);
    expect(copy.rows.length).toEqual(0);
    expect(copy.relation).toEqual(weather.relation);
    expect(copy.attrs).toEqual(weather.attrs);
    const copy2 = Relation.copy(copy, { relation: 'test' });
    expect(copy2.rows).toEqual(copy.rows);
    expect(copy2.attrs).toEqual(weather.attrs);
    expect(copy2.relation).toEqual('test');
});

test('Relation.withoutAttr', () => {
    const copy = Relation.withoutAttr(weather, 'play');
    expect(copy.attrs.includes('play')).toBeFalsy();
    expect(copy.attrs.length).toEqual(weather.attrs.length - 1);
    expect(copy.relation).toEqual(weather.relation);
    expect(copy.rows).toEqual(weather.rows);
});

test('Relation.where', () => {
    const copy = Relation.where(weather, { outlook: 'sunny' });
    expect(copy.rows.length).toBeGreaterThan(0);
    expect(copy.rows.every(row => row['outlook'] === 'sunny')).toBeTruthy();
    expect(copy.relation).toEqual(weather.relation);
    expect(copy.attrs).toEqual(weather.attrs);
});

test('Relation.classses', () => {
    expect(Relation.classes(weather, 'outlook')).toMatchObject([
        'sunny', 'overcast', 'rainy',
    ])
});

test('Relation.countClasses', () => {
    expect(Relation.countClasses(weather, 'outlook')).toMatchObject({
        sunny: 5,
        overcast: 4,
        rainy: 5,
    });
});

test('Relation.count', () => {
    expect(Relation.count(weather, 'outlook')).toMatchObject([5, 4, 5]);
});

test('Relation.counts', () => {
    expect(Relation.counts(weather, 'outlook', 'play')).toMatchObject([
        [3, 2], [4], [3, 2],
    ]);
});

test('Relation.entropies', () => {
    const entropies = Relation.entropies(weather, 'play');
    expect(entropies[0]).toBeCloseTo(.692);
    expect(entropies[1]).toBeCloseTo(.911);
    expect(entropies[2]).toBeCloseTo(.788);
    expect(entropies[3]).toBeCloseTo(.892);
});

test('Relation.probability', () => {
    expect(Relation.probability(weather, { outlook: 'sunny'}, { play: 'yes' })).toEqual(2 / 9);
    expect(Relation.probability(weather, { temperature: 'cool'}, { play: 'yes' })).toEqual(3 / 9);
    expect(Relation.probability(weather, { humidity: 'high'}, { play: 'yes' })).toEqual(3 / 9);
    expect(Relation.probability(weather, { windy: 'TRUE'}, { play: 'yes' })).toEqual(3 / 9);
    expect(Relation.probability(weather, { play: 'yes' })).toEqual(9 / 14);
});

test('Relation.orderByOccurence', () => {
    expect(Relation.orderedByOccurence(weather, 'play')).toMatchObject([
        'yes', 'no'
    ]);
    expect(Relation.orderedByOccurence(weather, 'temperature')).toMatchObject([
        'mild', 'hot', 'cool',
    ]);
});