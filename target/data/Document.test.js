"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Document_1 = require("./Document");
const china = Document_1.Document.parseFile('./data/china-data.txt', './data/china-labels.txt');
test('Document.copy', () => {
    const ds = Document_1.Document.copy(china, { docs: [] });
    expect(ds.vocab).toEqual(china.vocab);
    expect(ds.docs).toMatchObject([]);
    const ds2 = Document_1.Document.copy(china, { vocab: new Set() });
    expect(ds2.vocab).toMatchObject(new Set());
    expect(ds2.docs).toEqual(china.docs);
});
test('Document.vocab', () => {
    expect(china.vocab.size).toEqual(6);
});
test('Document.classes', () => {
    expect(Document_1.Document.classes(china)).toMatchObject(['yes', 'no']);
    expect(Document_1.Document.classes(Document_1.Document.parseFile('./data/china-data.txt'))).toMatchObject([]);
});
test('Document.parseDocument', () => {
    const str = 'a new voyage will fill your life with untold memories';
    expect(Document_1.Document.parseDocument(str, Document_1.Document.vocab(str))).toMatchObject({
        str,
        hist: {
            a: 1,
            new: 1,
            voyage: 1,
            will: 1,
            fill: 1,
            your: 1,
            life: 1,
            with: 1,
            untold: 1,
            memories: 1,
        },
    });
});
test('Document.parseFile', () => {
    const ds = Document_1.Document.parseFile('./data/traindata.txt');
    expect(ds.docs[0].cls).toBeUndefined();
});
test('Document.where', () => {
    expect(Document_1.Document.where(china, 'yes').docs.length).toEqual(3);
    expect(Document_1.Document.where(china, 'no').docs.length).toEqual(1);
});
test('Document.count', () => {
    expect(Document_1.Document.count(china)).toEqual(11);
    expect(Document_1.Document.count(china, 'Chinese')).toEqual(6);
});
test('Document.clsProbability', () => {
    expect(Document_1.Document.clsProbability(china, 'yes')).toEqual(3 / 4);
    expect(Document_1.Document.clsProbability(china, 'no')).toEqual(1 / 4);
});
test('Document.termProbability', () => {
    const yes = Document_1.Document.where(china, 'yes');
    expect(Document_1.Document.termProbability(yes, 'Chinese')).toEqual(3 / 7);
    expect(Document_1.Document.termProbability(yes, 'Tokyo')).toEqual(1 / 14);
    expect(Document_1.Document.termProbability(yes, 'Japan')).toEqual(1 / 14);
});
