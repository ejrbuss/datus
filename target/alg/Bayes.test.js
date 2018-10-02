"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bayes_1 = require("./Bayes");
const ARFF_1 = require("../data/ARFF");
const weather = ARFF_1.ARFF.parseFile('./data/weather.nominal.arff');
test('Bayes.numerator', () => {
    expect(Bayes_1.Bayes.numerator(weather, { play: 'yes' }, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, false)).toBeCloseTo(0.0053);
    expect(Bayes_1.Bayes.numerator(weather, { play: 'no' }, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, false)).toBeCloseTo(0.0206);
    expect(Bayes_1.Bayes.numerator(weather, { play: 'yes' }, {
        outlook: 'sunny',
        temperature: 'cool',
        humidity: 'high',
        windy: 'TRUE',
    }, true)).toBeCloseTo(0.0069);
});
test('Bayes.tree', () => {
    const tree = Bayes_1.Bayes.tree(weather, {
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
    expect(tree.children.yes.probability).toBeCloseTo(.205);
    expect(tree.children.no.probability).toBeCloseTo(.795);
    const tree2 = Bayes_1.Bayes.tree(weather, {
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
    expect(tree2.children.yes.probability).toBeCloseTo(.254);
    expect(tree2.children.no.probability).toBeCloseTo(.746);
});
