"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Maths_1 = require("./Maths");
const total = (...cs) => Maths_1.Maths.sum(...cs.map(c => Maths_1.Maths.sum(...c)));
const probability = (c) => c.map(n => n / exports.Count.total(c));
const info = (...cs) => Maths_1.Maths.sum(...cs.map(c => Maths_1.Maths.entropy(...exports.Count.probability(c)) * exports.Count.total(c) / exports.Count.total(...cs)));
exports.Count = {
    total,
    probability,
    info,
};
