"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relation_1 = require("../data/relation");
const Maths_1 = require("../core/Maths");
const selectAttribute = (r, cls) => {
    const entropies = relation_1.Relation.entropies(r, cls);
    const lowest = Maths_1.Maths.min(...entropies);
    return r.attrs[entropies.indexOf(lowest)];
};
const splitAttribute = (r, attr, val) => relation_1.Relation.where(r, { [attr]: val });
const done = (r, cls) => relation_1.Relation.count(r, cls).length <= 1;
const tree = (r, cls) => {
    r = relation_1.Relation.withoutAttr(r, cls);
    if (!exports.ID3.done(r, cls)) {
        const attr = exports.ID3.selectAttribute(r, cls);
        const children = relation_1.Relation.classes(r, attr).reduce((children, val) => (Object.assign({}, children, { [val]: tree(exports.ID3.splitAttribute(r, attr, val), cls) })), {});
        return { attr, children };
    }
    return { clsVal: r.rows[0][cls], probability: 1 };
};
exports.ID3 = {
    selectAttribute,
    splitAttribute,
    done,
    tree,
};
