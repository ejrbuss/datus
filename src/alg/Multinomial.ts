import { Document, DocumentSet, Histogram, Vocab } from '../data/Document';
import { Maths } from '../core/Maths';
import { Obj } from '../util/Obj';

export type MultinomialOdds = {
    clss: string[];
    priors: Histogram;
    conds: { [cls: string]: Histogram; }
};

const priors = (ds: DocumentSet, clss: string[]): Histogram =>
    clss.reduce((hist: Histogram, cls) => {
        hist[cls] = Document.clsProbability(ds, cls);
        return hist;
    }, {});

const condProbability = (ds: DocumentSet, cls: string): Histogram =>
    Array.from(ds.vocab).reduce((hist: Histogram, term) => {
        hist[term] = Document.termProbability(Document.where(ds, cls), term);
        return hist;
    }, {});

const odds = (ds: DocumentSet, clss: string[] = Document.classes(ds)): MultinomialOdds => ({
    clss,
    priors: Multinomial.priors(ds, clss),
    conds: clss.reduce((conds: { [cls: string]: Histogram }, cls) => {
        conds[cls] = Multinomial.condProbability(ds, cls); 
        return conds;
    }, {}),
});

const classify= (d: Document, odds: MultinomialOdds): string => {
    const ps = odds.clss.map(cls => 
        Maths.log(odds.priors[cls]) + Maths.sum(...Array.from(Document.vocab(d.str)).map(term =>
            Maths.nanz(Maths.log(odds.conds[cls][term]), 0)
        )),
    );
    return odds.clss[ps.indexOf(Maths.max(...ps))];
};

const stop = (odds: MultinomialOdds, vocab: Vocab) =>
    ({ ...odds, conds: Obj.map(odds.conds, cond =>
        Obj.filter(cond, (_, term) => !vocab.has(term))
    )});

export const Multinomial = {
    priors,
    condProbability,
    odds,
    classify,
    stop,
};