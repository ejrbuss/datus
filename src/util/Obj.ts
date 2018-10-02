export type Obj<T> = { [key: string]: T }

const map = <T, V>(obj: Obj<T>, fn: (val: T, key: string, obj: Obj<T>) => V): Obj<V> =>
    Object.keys(obj).reduce((r: Obj<V>, key) => {
        r[key] = fn(obj[key], key, obj);
        return r;
    }, {});

const filter = <T>(obj: Obj<T>, fn: (val: T, key: string, obj: Obj<T>) => any): Obj<T> =>
    Object.keys(obj).reduce((r: Obj<T>, key) => {
        if (fn(obj[key], key, obj)) {
            r[key] = obj[key];
        }
        return r;
    }, {})

export const Obj = {
    map,
    filter,
}