import { Value } from '../data/relation';

export type Decision = {
    clsVal: Value;
    probability: number;
};

export type DecisionTree = {
    attr: string;
    children: { [attrVal: string]: DecisionTree | Decision };
};
