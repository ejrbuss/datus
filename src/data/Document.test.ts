import { Document } from './Document';

const china = Document.parseFile(
    './data/china-data.txt', 
    './data/china-labels.txt',
);

test('Document.copy', () => {
    const ds = Document.copy(china, { docs: [] });
    expect(ds.vocab).toEqual(china.vocab);
    expect(ds.docs).toMatchObject([]);
    const ds2 = Document.copy(china, { vocab: new Set() });
    expect(ds2.vocab).toMatchObject(new Set());
    expect(ds2.docs).toEqual(china.docs);
});

test('Document.vocab', () => {
    expect(china.vocab.size).toEqual(6);
});

test('Document.classes', () => {
    expect(Document.classes(china)).toMatchObject([ 'yes', 'no' ]);
    expect(Document.classes(Document.parseFile('./data/china-data.txt'))).toMatchObject([]);
});

test('Document.parseDocument', () => {
    const str = 'a new voyage will fill your life with untold memories';
    expect(Document.parseDocument(str, Document.vocab(str))).toMatchObject({
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
    })
});

test('Document.parseFile', () => {
    const ds = Document.parseFile('./data/traindata.txt');
    expect(ds.docs[0].cls).toBeUndefined();
});

test('Document.where', () => {
    expect(Document.where(china, 'yes').docs.length).toEqual(3);
    expect(Document.where(china, 'no').docs.length).toEqual(1);
});

test('Document.count', () => {
    expect(Document.count(china)).toEqual(11);
    expect(Document.count(china, 'Chinese')).toEqual(6);
});

test('Document.clsProbability', () => {
    expect(Document.clsProbability(china, 'yes')).toEqual(3 / 4);
    expect(Document.clsProbability(china, 'no')).toEqual(1 / 4);
});

test('Document.termProbability', () => {
    const yes = Document.where(china, 'yes');
    expect(Document.termProbability(yes, 'Chinese')).toEqual(3 / 7);
    expect(Document.termProbability(yes, 'Tokyo')).toEqual(1 / 14);
    expect(Document.termProbability(yes, 'Japan')).toEqual(1 / 14);
});