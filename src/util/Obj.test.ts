import { Obj } from './Obj';

test('Obj.map', () => {
    expect(Obj.map({ x: 1, y: 2 }, n => n * n )).toMatchObject({
        x: 1, y : 4,
    })
});

test('Obj.filter', () => {
    expect(Obj.filter({ x: 1, y: 2 }, n => n === 2)).toMatchObject({ y: 2 });
});