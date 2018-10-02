import { Document, DocumentSet } from '../data/Document';
import { Multinomial } from '../alg/Multinomial';
import { Maths } from '../core/Maths';
import { writeFileSync } from 'fs';
import { zip } from 'lodash';

const trainingPath = {
    data: './data/traindata.txt',
    labels: './data/trainlabels.txt',
};
const testingPath = {
    data: './data/testdata.txt',
    labels: './data/testlabels.txt',
};

const training       = Document.parseFile(trainingPath.data, trainingPath.labels);
const trainingLabels = Document.parselabelsFile(trainingPath.labels);
const testing        = Document.parseFile(testingPath.data, testingPath.labels);
const testingLabels  = Document.parselabelsFile(testingPath.labels);

const odds = Multinomial.odds(training);

const guess = (ds: DocumentSet): string[] =>
    ds.docs.map(d => Multinomial.classify(d, odds));

const results = (ds: DocumentSet, labels: string[]): [number, number] => {
    const guessed = guess(ds);
    const correct = Maths.sum(...guessed.map((g, i) => g === labels[i] ? 1 : 0));
    return [correct, guessed.length];
};

const percent = ([n, d]: [number, number]) =>
    (n / d * 100).toFixed(2);
const fraction = ([n, d]: [number, number]) =>
    `${n} / ${d}`

const trainResults = results(training, trainingLabels);
const testResults  = results(testing, testingLabels);
const log = `
Fortune Cookies Naive Bayes (Multinomial) Classification
 > Training Data (${trainingPath.data}): ${percent(trainResults)}% (${fraction(trainResults)})
 > Testing Data  (${testingPath.data}):  ${percent(testResults)}% (${fraction(testResults)})
`;

console.log(log);

writeFileSync('./results.txt', log + `
Trained Odds
------------
${JSON.stringify(odds, null, 4)}

Training Data Label Comaprison
----------------------------------------
| Match | Expected | Actual | Document |
------------------------------------------>
${zip(guess(training), trainingLabels).map(([e, a], i) => {
    return `| ${e === a ? 'yes' : 'no '}   | ${e}        | ${a}      | ${training.docs[i].str}`
}).join('\n')}
------------------------------------------>

Testing Data Label Comaprison
----------------------------------------
| Match | Expected | Actual | Document |
------------------------------------------>
${zip(guess(testing), testingLabels).map(([e, a], i) => {
    return `| ${e === a ? 'yes' : 'no '}   | ${e}        | ${a}      | ${testing.docs[i].str}`
}).join('\n')}
------------------------------------------>
`);

console.log('!! Full results written to results.txt !!\n');