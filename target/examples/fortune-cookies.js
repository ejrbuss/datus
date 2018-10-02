"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Document_1 = require("../data/Document");
const Multinomial_1 = require("../alg/Multinomial");
const Maths_1 = require("../core/Maths");
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const trainingPath = {
    data: './data/traindata.txt',
    labels: './data/trainlabels.txt',
};
const testingPath = {
    data: './data/testdata.txt',
    labels: './data/testlabels.txt',
};
const training = Document_1.Document.parseFile(trainingPath.data, trainingPath.labels);
const trainingLabels = Document_1.Document.parselabelsFile(trainingPath.labels);
const testing = Document_1.Document.parseFile(testingPath.data, testingPath.labels);
const testingLabels = Document_1.Document.parselabelsFile(testingPath.labels);
const stopWords = new Set(['a', 'an', 'the', 'and', 'but', 'to']);
const tuning = 10;
const odds = Multinomial_1.Multinomial.stop(Multinomial_1.Multinomial.odds(training), stopWords);
const guess = (ds) => ds.docs.map(d => Multinomial_1.Multinomial.classify(d, odds, tuning));
const results = (ds, labels) => {
    const guessed = guess(ds);
    const correct = Maths_1.Maths.sum(...guessed.map((g, i) => g === labels[i] ? 1 : 0));
    return [correct, guessed.length];
};
const percent = ([n, d]) => (n / d * 100).toFixed(2);
const fraction = ([n, d]) => `${n} / ${d}`;
const trainResults = results(training, trainingLabels);
const testResults = results(testing, testingLabels);
const log = `
Fortune Cookies Naive Bayes (Multinomial) Classification
 > Training Data (${trainingPath.data}): ${percent(trainResults)}% (${fraction(trainResults)})
 > Testing Data  (${testingPath.data}):  ${percent(testResults)}% (${fraction(testResults)})
`;
console.log(log);
fs_1.writeFileSync('./results.txt', log + `
Trained Odds
------------
${JSON.stringify(odds, null, 4)}

Training Data Label Comaprison
----------------------------------------
| Match | Expected | Actual | Document |
------------------------------------------>
${lodash_1.zip(guess(training), trainingLabels).map(([e, a], i) => {
    return `| ${e === a ? 'yes' : 'no '}   | ${e}        | ${a}      | ${training.docs[i].str}`;
}).join('\n')}
------------------------------------------>

Testing Data Label Comaprison
----------------------------------------
| Match | Expected | Actual | Document |
------------------------------------------>
${lodash_1.zip(guess(testing), testingLabels).map(([e, a], i) => {
    return `| ${e === a ? 'yes' : 'no '}   | ${e}        | ${a}      | ${testing.docs[i].str}`;
}).join('\n')}
------------------------------------------>
`);
console.log('!! Full results written to results.txt !!\n');
