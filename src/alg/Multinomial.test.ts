import { Multinomial } from './Multinomial';
import { Document } from '../data/Document';

const china = Document.parseFile(
    './data/china-data.txt', 
    './data/china-labels.txt',
);

test('Multinomial.priors', () => {
    expect(Multinomial.priors(china, ['yes', 'no'])).toMatchObject({
        yes: 3 / 4, no: 1 / 4,
    });
});

test('Multinomial.condProbability', () => {
    expect(Multinomial.condProbability(china, 'yes')).toMatchObject({
        Chinese: 6 / 14,
        Beijing: 2 / 14,
        Tokyo: 1 / 14,
        Japan: 1 / 14,
    });
});

test('Multinomial.odds', () => {
    expect(Multinomial.odds(china)).toMatchObject({
        clss: ['yes', 'no'],
        priors: { yes: 3/ 4, no: 1 / 4 },
        conds: {
            yes: {
                Chinese: 6 / 14,
                Beijing: 2 / 14,
                Tokyo: 1 / 14,
                Japan: 1 / 14,
            },
            no: {
                Chinese: 2 / 9,
                Beijing: 1 / 9,
                Tokyo: 2 / 9,
                Japan: 2 / 9,
            },
        },
    });
});

test('Multinomial.classify', () => {
    const odds = Multinomial.odds(china);
    const str = 'Chinese Chinese Chinese Tokyo Japan';
    const d = Document.parseDocument(str, Document.vocab(str));
    expect(Multinomial.classify(d, odds)).toEqual('no');
});

test('Multinomial.stop', () => {
    const odds = Multinomial.stop(
        Multinomial.odds(china), 
        new Set(['Chinese', 'Beijing']),
    );
    expect(odds).toMatchObject({
        clss: ['yes', 'no'],
        priors: { yes: 3/ 4, no: 1 / 4 },
        conds: {
            yes: {
                Tokyo: 1 / 14,
                Japan: 1 / 14,
            },
            no: {
                Tokyo: 2 / 9,
                Japan: 2 / 9,
            },
        },
    });
    expect(odds.conds.yes.Chinese).toBeUndefined();
    expect(odds.conds.yes.Beijing).toBeUndefined();
    expect(odds.conds.no.Chinese).toBeUndefined();
    expect(odds.conds.no.Beijing).toBeUndefined();
});