"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Document_1 = require("../data/Document");
const Maths_1 = require("../core/Maths");
const Obj_1 = require("../util/Obj");
const priors = (ds, clss) => clss.reduce((hist, cls) => {
    hist[cls] = Document_1.Document.clsProbability(ds, cls);
    return hist;
}, {});
const condProbability = (ds, cls) => Array.from(ds.vocab).reduce((hist, term) => {
    hist[term] = Document_1.Document.termProbability(Document_1.Document.where(ds, cls), term);
    return hist;
}, {});
const odds = (ds, clss = Document_1.Document.classes(ds)) => ({
    clss,
    priors: exports.Multinomial.priors(ds, clss),
    conds: clss.reduce((conds, cls) => {
        conds[cls] = exports.Multinomial.condProbability(ds, cls);
        return conds;
    }, {}),
});
const classify = (d, odds) => {
    const ps = odds.clss.map(cls => Maths_1.Maths.log(odds.priors[cls]) + Maths_1.Maths.sum(...Array.from(Document_1.Document.vocab(d.str)).map(term => Maths_1.Maths.nanz(Maths_1.Maths.log(odds.conds[cls][term]), 0))));
    return odds.clss[ps.indexOf(Maths_1.Maths.max(...ps))];
};
const stop = (odds, vocab) => (Object.assign({}, odds, { conds: Obj_1.Obj.map(odds.conds, cond => Obj_1.Obj.filter(cond, (_, term) => !vocab.has(term))) }));
exports.Multinomial = {
    priors,
    condProbability,
    odds,
    classify,
    stop,
};