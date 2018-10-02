"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map = (obj, fn) => Object.keys(obj).reduce((r, key) => {
    r[key] = fn(obj[key], key, obj);
    return r;
}, {});
const filter = (obj, fn) => Object.keys(obj).reduce((r, key) => {
    if (fn(obj[key], key, obj)) {
        r[key] = obj[key];
    }
    return r;
}, {});
exports.Obj = {
    map,
    filter,
};
