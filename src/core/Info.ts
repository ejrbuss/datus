import { Lang, LangEnv } from './Lang';
import { flatten } from 'lodash';

const env: LangEnv = {
    flatten: {
        numeric: false,
        fn: cs => flatten(cs),
    },
    probability: {
        numeric: true,
        fn: cs => cs.map(c => c / cs.reduce((acc, a) => acc + a, 0)),
    },
    info: {
        numeric: true,
        fn: cs => Lang.make('entropy', Lang.make('probability', ...cs)),
    },
    expectedInfo: {
        numeric: false,
        fn: cs => Lang.make('sum', cs.map(c => 
            Lang.make('mul', 
                Lang.make('info', c), 
                Lang.make('div', 
                    Lang.make('sum', c),
                    Lang.make('sum', Lang.make('flatten', cs)),
                )
            )
        ))
    }
};
/*
const info = (c: Count | Count[], t: number = Count.total(c)): number =>
    Array.isArray(c)
        ? Maths.sum(c.map(cp => Maths.sum(info(cp, Count.total(c)))))
        : Maths.entropy(Object.values(Count.probability(c))) * Count.total(c) / t;

const expectedInfo = (r: Relation, attr: string, cls: string) =>
    info(Relation
        .classes(r, attr)
        .map(attrVal => Relation.where(r, row => row[attr] === attrVal))
        .map(nr => Relation.count(nr, cls))
    );
*/
export const Info = {
    env,
};