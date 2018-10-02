"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Obj_1 = require("./Obj");
test('Obj.map', () => {
    expect(Obj_1.Obj.map({ x: 1, y: 2 }, n => n * n)).toMatchObject({
        x: 1, y: 4,
    });
});
test('Obj.filter', () => {
    expect(Obj_1.Obj.filter({ x: 1, y: 2 }, n => n === 2)).toMatchObject({ y: 2 });
});
