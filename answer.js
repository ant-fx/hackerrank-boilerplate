(function main() {
  'use strict';

  const log = console.log;
  const comment = line => log(`# ${line}`);

  var run = input => {

    comment(`You can write comments here`);
    comment(`You can write comments here`);
    comment(`You can write comments here`);
    comment(`You can write comments here`);
    comment(`You can write comments here`);
    comment(`You can write comments here`);
    comment(`You can write comments here`);
    comment(`You can write comments here`);

    log('5');
  };

  // get the input data
  let input = '';
  process.stdin.resume();
  process.stdin.setEncoding('ascii');
  process.stdin.on('data', data => input += data);
  process.stdin.on('end', () => run(input));
})();
