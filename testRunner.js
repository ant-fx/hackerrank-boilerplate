'use strict';

const spawn = require('child_process').spawn;
const series = require('promise-series2');
const split = require('split');
const fs = require('fs');
const diff = require('diff');

require('colors');

const log = console.log;

// list all files in ./tests
const testFiles = fs.readdirSync('./tests');

const runTest = file => {
  return new Promise((resolve,reject) => {
    try {
      log('\n########################\n'.bold.white);

      // read the test spec
      const testSpec = fs.readFileSync(`./tests/${file}`, 'ascii');

      // parse the test spec
      const splitter = '#OUTPUT';
      const splitIndex= testSpec.indexOf(splitter);
      const input = testSpec.substr(0,splitIndex).trim();
      const expected = splitIndex !== -1 ? testSpec.substr(splitIndex+splitter.length).trim() : '';
      const child = spawn('node', ['answer.js'], {cwd: process.cwd()});

      // setup input/output
      child.stdout.setEncoding('ascii');
      child.stderr.setEncoding('ascii');
      child.stdin.setEncoding('ascii');

      // write the data
      child.stdin.write(input);
      child.stdin.end();

      let actual = '';
      let comments = '';

      child.stdout.pipe(split())
        .on('data', function (line) {

          let lineWithNewLine = `${line}\n`;

          if (line.indexOf('#') === 0)
            comments += lineWithNewLine;
          else
            actual += lineWithNewLine;
        });

      child.stderr.on('data', data => log((data+'')));

      child.on('close', () => {

        const actualClean = actual.trim();

        if (expected === actualClean)
          log(`${'OK:'.green} ${file}\n`.bold);
        else
          log(`${'FAILED:'.red} ${file}\n`.bold);

        if (comments.length) {
          log('COMMENTS:'.cyan.bold);
          log(`${comments}`);
        }

        /*
        // write the actual results
        if (expected !== actualClean) {
          log(`EXPECTED:`.green.bold);
          log(`${expected}\n`);
          log(`ACTUAL:`.red.bold);
        }
        else
          log(`RESULTS:`.green.bold);
        log(`${actualClean}`);*/

        log(`RESULTS:`.green.bold);
        const differences = diff.diffChars(expected, actualClean);

        differences.forEach(part => {

          if (part.added)
            process.stderr.write(`${part.value}`.green.bold);

          else if (part.removed)
            process.stderr.write(`${part.value}`.red.bold);

          else
            process.stderr.write(part.value.white);
        });

        log();

        resolve();
      });
    }
    catch (err) {
      reject(err);
    }
  });
};

series(testFiles,runTest)
  .then(() => log());
