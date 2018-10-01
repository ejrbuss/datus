import { readFileSync } from 'fs';
import { chunk } from 'lodash';
import { Re } from '../util/Re';
import { Relation, Row } from './relation';

const reComment   = /[#%].*/g;
const reRelation  = /@relation\s+([\w\.-]+)/ig;
const reAttribute = /@attribute\s+([\w\.-]+)/ig;
const reData      = /@data\s+(.*)/sg;
const reNumber    = /[-+]?\d*\.\d+|\d+/;
const reSplit     = /,|\n/g;

const clean = (str: string) =>
    str.replace(reComment, '').trim();

const maybeNumber = (str: string) =>
    reNumber.test(str) ? parseFloat(str) : str.trim();

const parse = (str: string): Relation => {
    str = clean(str);
    const relation = Re.findFirstGroup(reRelation, str);
    const attrs    = Re.findAllGroup(reAttribute, str);
    const rows     = chunk(Re
        .findFirstGroup(reData, str)
        .split(reSplit)
        .map(maybeNumber),
        attrs.length
    ).map(values =>
        attrs.reduce((row: Row, attr, i) => {
            row[attr] = values[i];
            row[i]    = values[i];
            return row;
        }, {})
    );
    return { relation, attrs, rows };
};

const parseFile = (path: string): Relation =>
    parse(readFileSync(path, 'utf8'));

export const ARFF = {
    clean,
    maybeNumber,
    parseFile,
    parse,
};