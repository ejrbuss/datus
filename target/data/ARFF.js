"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const Re_1 = require("../util/Re");
const reComment = /[#%].*/g;
const reRelation = /@relation\s+([\w\.-]+)/ig;
const reAttribute = /@attribute\s+([\w\.-]+)/ig;
const reData = /@data\s+(.*)/sg;
const reNumber = /[-+]?\d*\.\d+|\d+/;
const reSplit = /,|\n/g;
const clean = (str) => str.replace(reComment, '').trim();
const maybeNumber = (str) => reNumber.test(str) ? parseFloat(str) : str.trim();
const parse = (str) => {
    str = exports.ARFF.clean(str);
    const relation = Re_1.Re.findFirstGroup(reRelation, str);
    const attrs = Re_1.Re.findAllGroup(reAttribute, str);
    const rows = lodash_1.chunk(Re_1.Re
        .findFirstGroup(reData, str)
        .split(reSplit)
        .map(exports.ARFF.maybeNumber), attrs.length).map(values => attrs.reduce((row, attr, i) => {
        row[attr] = values[i];
        row[i] = values[i];
        return row;
    }, {}));
    return { relation, attrs, rows };
};
const parseFile = (path) => exports.ARFF.parse(fs_1.readFileSync(path, 'utf8'));
exports.ARFF = {
    clean,
    maybeNumber,
    parseFile,
    parse,
};
