import { Count } from './Count';

test('Count.total', () => {
    expect(Count.total({ x: 4, y: 4 })).toEqual(8);
});

test('Count.probability', () => {
    expect(Count.probability({ x: 4, y: 4})).toMatchObject({ x: .5, y: .5 });
});