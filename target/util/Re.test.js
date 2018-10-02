"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Re_1 = require("./Re");
test('Re.findAll', () => {
    expect(Re_1.Re.findAll(/a/g, 'aaaa')).toMatchObject([
        { substring: 'a', groups: [0, 'aaaa'] },
        { substring: 'a', groups: [1, 'aaaa'] },
        { substring: 'a', groups: [2, 'aaaa'] },
        { substring: 'a', groups: [3, 'aaaa'] },
    ]);
});
test('Re.findFirst', () => {
    expect(Re_1.Re.findFirst(/a./g, 'bbbaaacad')).toMatchObject({
        substring: 'aa', groups: [3, 'bbbaaacad'],
    });
});
