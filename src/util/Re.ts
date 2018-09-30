export type Match = {
    substring: string;
    groups: string[];
};

const findAll = (regex: RegExp, rawstring: string) => {
    const results: Match[] = [];
    rawstring.replace(regex, (substring, ...groups) => {
        results.push({ substring, groups });
        return '';
    });
    return results;
};

const findFirst = (regex: RegExp, rawString: string) =>
    findAll(regex, rawString)[0];

const findAllGroup = (regex: RegExp, rawString: string, group: number = 0) =>
    findAll(regex, rawString).map(m => m.groups[group]);

const findFirstGroup = (regex: RegExp, rawString: string, group: number = 0) =>
    findAllGroup(regex, rawString, group)[0];

export const Re = {
    findAll,
    findFirst,
    findAllGroup,
    findFirstGroup,
}