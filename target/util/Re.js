"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findAll = (regex, rawstring) => {
    const results = [];
    rawstring.replace(regex, (substring, ...groups) => {
        results.push({ substring, groups });
        return '';
    });
    return results;
};
const findFirst = (regex, rawString) => findAll(regex, rawString)[0];
const findAllGroup = (regex, rawString, group = 0) => findAll(regex, rawString).map(m => m.groups[group]);
const findFirstGroup = (regex, rawString, group = 0) => findAllGroup(regex, rawString, group)[0];
exports.Re = {
    findAll,
    findFirst,
    findAllGroup,
    findFirstGroup,
};
