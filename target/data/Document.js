"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Re_1 = require("../util/Re");
const Maths_1 = require("../core/Maths");
const copy = (ds, partial) => ({
    vocab: partial.vocab || ds.vocab,
    docs: partial.docs || ds.docs,
});
const vocab = (str) => str.split(/\s/g).reduce((set, substr) => set.add(substr), new Set());
const classes = (ds) => Array.from(ds.docs.reduce((s, d) => d.cls ? s.add(d.cls) : s, new Set()));
const parseDocument = (str, language) => ({
    str, hist: Array.from(language).reduce((hist, term) => {
        hist[term] = Re_1.Re.findAll(new RegExp(/(^|\s)/.source + term + /(?=$|\s)/.source, 'g'), str).length;
        return hist;
    }, {}),
});
const parse = (str) => ({
    vocab: exports.Document.vocab(str.trim()),
    docs: str.trim().split(/\n/g).map(substr => exports.Document.parseDocument(substr, exports.Document.vocab(str))),
});
const parseFile = (path, labelsPath) => labelsPath
    ? exports.Document.label(exports.Document.parse(fs_1.readFileSync(path, 'utf8')), exports.Document.parselabelsFile(labelsPath))
    : exports.Document.parse(fs_1.readFileSync(path, 'utf8'));
const label = (ds, labels) => exports.Document.copy(ds, { docs: ds.docs.map((d, i) => (Object.assign({}, d, { cls: labels[i] }))) });
const parseLabels = (str) => str.split(/\n/g).map(substr => substr.trim());
const parselabelsFile = (path) => exports.Document.parseLabels(fs_1.readFileSync(path, 'utf8'));
const where = (ds, condition) => typeof condition === 'function'
    ? exports.Document.copy(ds, { docs: ds.docs.filter(condition) })
    : exports.Document.where(ds, d => d.cls === condition);
const count = (ds, term) => term
    ? Maths_1.Maths.sum(...ds.docs.map(d => d.hist[term]))
    : Maths_1.Maths.sum(...ds.docs.map(d => d.str.split(/\s/g).length));
const clsProbability = (ds, cls) => exports.Document.where(ds, cls).docs.length / ds.docs.length;
const termProbability = (ds, term) => (exports.Document.count(ds, term) + 1) /
    (exports.Document.count(ds) + ds.vocab.size);
exports.Document = {
    copy,
    vocab,
    classes,
    parseDocument,
    parse,
    parseFile,
    label,
    parseLabels,
    parselabelsFile,
    where,
    count,
    clsProbability,
    termProbability,
};
