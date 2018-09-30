import { Info } from './Info';
import { Lang } from './Lang';
import { Maths } from './Maths';
import { ARFF } from '../data/ARFF';
import { Relation } from '../data/relation';

Lang.env = { ...Lang.env, ...Maths.env, ...Info.env };

const weather = ARFF.parseFile('./data/weather.nominal.arff');

test('Info.info', () => {
    expect(Lang.$($ => $.info(2, 3))).toBeCloseTo(.971);
    expect(Lang.$($ => $.info(4, 0))).toBeCloseTo(0);
    expect(Lang.$($ => $.info(3, 2))).toBeCloseTo(.971);
    expect(Lang.$($ => $.info(2, 2))).toBeCloseTo(1);
    expect(Lang.$($ => $.info(4, 2))).toBeCloseTo(.918);
    expect(Lang.$($ => $.info(3, 1))).toBeCloseTo(.811);
    expect(Lang.$($ => $.info(3, 4))).toBeCloseTo(.985);
    expect(Lang.$($ => $.info(6, 1))).toBeCloseTo(.592);
    expect(Lang.$($ => $.info(6, 2))).toBeCloseTo(.811);
    expect(Lang.$($ => $.info(3, 3))).toBeCloseTo(1);
});    

test('Info.expectedInfo', () => {
    expect(Lang.$($ => $.expectedInfo(Relation.counts(weather, 'outlook', 'play')))).toBeCloseTo(.693);
    expect(Lang.$($ => $.expectedInfo(Relation.counts(weather, 'temperature', 'play')))).toBeCloseTo(.911);
    expect(Lang.$($ => $.expectedInfo(Relation.counts(weather, 'humidity', 'play')))).toBeCloseTo(.788);
    expect(Lang.$($ => $.expectedInfo(Relation.counts(weather, 'windy', 'play')))).toBeCloseTo(.892);
});
