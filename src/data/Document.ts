import { readFileSync } from 'fs';
import { Re } from '../util/Re';
import { Maths } from '../core/Maths';

export type Vocab = Set<string>;
export type Histogram =  { [term: string]: number };

export type Document = {
    cls?: string;
    str: string;
    hist: Histogram;
}

export type DocumentSet = {
    vocab: Vocab;
    docs: Document[];
};

const copy = (ds: DocumentSet, partial: Partial<DocumentSet>): DocumentSet => ({
    vocab:  partial.vocab  || ds.vocab,
    docs: partial.docs || ds.docs,
});

const vocab = (str: string): Vocab =>
    str.split(/\s/g).reduce((set: Vocab, substr) => set.add(substr), new Set());

const classes = (ds: DocumentSet): string[] =>
    Array.from(ds.docs.reduce((s: Set<string>, d) => d.cls ? s.add(d.cls): s, new Set()));

const parseDocument = (str: string, language: Vocab): Document => ({
    str, hist: Array.from(language).reduce((hist: Histogram, term) => {
        hist[term] = Re.findAll(new RegExp(/(^|\s)/.source + term + /(?=$|\s)/.source, 'g'), str).length;
        return hist;
    }, {}),
});

const parse = (str: string): DocumentSet => ({
    vocab: Document.vocab(str.trim()),
    docs: str.trim().split(/\n/g).map(substr => 
        Document.parseDocument(substr, Document.vocab(str))
    ),
});

const parseFile = (path: string, labelsPath?: string): DocumentSet =>
    labelsPath
        ? Document.label(Document.parse(readFileSync(path, 'utf8')), Document.parselabelsFile(labelsPath))
        : Document.parse(readFileSync(path, 'utf8'));

const label = (ds: DocumentSet, labels: string[]): DocumentSet => 
    Document.copy(ds, { docs: ds.docs.map((d, i) => ({ ...d, cls: labels[i] }) ) });

const parseLabels = (str: string): string[] =>
    str.split(/\n/g).map(substr => substr.trim());

const parselabelsFile = (path: string): string[] =>
    Document.parseLabels(readFileSync(path, 'utf8'));

const where = (ds: DocumentSet, condition: ((dcoument: Document) => boolean) | string): DocumentSet => 
    typeof condition === 'function'
        ? Document.copy(ds, { docs: ds.docs.filter(condition) })
        : Document.where(ds, d => d.cls === condition);

const count = (ds: DocumentSet, term?: string): number =>
    term
        ? Maths.sum(...ds.docs.map(d => d.hist[term]))
        : Maths.sum(...ds.docs.map(d => d.str.trim().split(/\s/g).length));

const clsProbability = (ds: DocumentSet, cls: string): number =>
    Document.where(ds, cls).docs.length / ds.docs.length;

const termProbability = (ds: DocumentSet, term: string): number =>
    (Document.count(ds, term) + 1) / 
        (Document.count(ds) + ds.vocab.size);

export const Document = {
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