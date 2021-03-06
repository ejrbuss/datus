import { Bayes } from './Bayes';
import { ARFF } from '../data/ARFF';
import { Decision } from './DecisionTree';

const weather = ARFF.parseFile('./data/weather.nominal.arff');

test('Bayes.numerator', () => {
    expect(Bayes.numerator(weather, { play: 'yes' }, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, false)).toBeCloseTo(0.0053);
    expect(Bayes.numerator(weather, { play: 'no' }, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, false)).toBeCloseTo(0.0206);
    expect(Bayes.numerator(weather, { play: 'yes' }, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, true)).toBeCloseTo(0.0069);
});

test('Bayes.tree', () => {
    const tree = Bayes.tree(weather, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, 'play', false);
    expect(tree).toMatchObject({
        attr: 'play',
        children: {
            yes: {
                clsVal: 'yes',
            },
            no: {
                clsVal: 'no',
            },
        }
    });
    expect((tree.children.yes as Decision).probability).toBeCloseTo(.205);
    expect((tree.children.no as Decision).probability).toBeCloseTo(.795);
    const tree2 = Bayes.tree(weather, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, 'play');
    expect(tree2).toMatchObject({
        attr: 'play',
        children: {
            yes: {
                clsVal: 'yes',
            },
            no: {
                clsVal: 'no',
            },
        }
    });
    expect((tree2.children.yes as Decision).probability).toBeCloseTo(.254);
    expect((tree2.children.no as Decision).probability).toBeCloseTo(.746);
});