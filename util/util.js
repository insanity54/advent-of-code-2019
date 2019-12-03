
module.exports.testIt = (actualOutput, expectedOutput) => {
  if (typeof actualOutput !== typeof expectedOutput) {
    console.log(`${actualOutput} type does not match ${expectedOutput} type`);
    console.error('actualOutput and expectedOutput types do not match');
    return false;
  }
  if (actualOutput.length !== expectedOutput.length) {
    console.log(`${actualOutput.length} length does not match ${expectedOutput.length} length`);
    console.error('actualOutput and expectedOutput lengths do not match');
    return false;
  }
  if (actualOutput != expectedOutput) {
    console.log(`${actualOutput} does not equal ${expectedOutput}`);
    console.error('acutualOutput does not equal expectedOutput');
    return false;
  }
  console.log(`test passed. ${actualOutput} equals ${expectedOutput}`)
  return true;
}
