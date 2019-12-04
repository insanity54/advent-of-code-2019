const fs = require('fs');
const fsp = fs.promises;


module.exports.testIt = (actualOutput, expectedOutput) => {
  let isFailed = false;
  let failMessage = '';
  if (typeof actualOutput !== typeof expectedOutput) {
    isFailed = true;
    failMessage = (`${actualOutput} and ${expectedOutput} types do not match`);
  }
  if (actualOutput.length !== expectedOutput.length) {
    isFailed = true;
    failMessage = (`${actualOutput} and ${expectedOutput} lengths do not match`);
  }
  if (actualOutput != expectedOutput) {
    isFailed = true;
    failMessage = (`${actualOutput} does not equal ${expectedOutput}`);
  }

  if (isFailed) {
    console.error(`test failed. ${failMessage}`);
    return false;
  } else {
    console.log(`test passed. ${actualOutput} equals ${expectedOutput}`)
    return true;
  }
}


module.exports.loadInput = (filename) => {
  return fsp.readFile(filename, { encoding: 'utf-8' })
    .then((input) => {
      return input
        .split('\n')
        .filter((i) => (i !== ''))
        .map((line) => line.split(','));
    })
  }
