#!/usr/bin/env node

fs = require('fs');
fsp = fs.promises;

let fuelAlgo = (mass) => {
  let f = (Math.floor(mass / 3) - 2);
  return f;
};


console.log(fuelAlgo(12));
console.log(fuelAlgo(14));
console.log(fuelAlgo(1969));
console.log(fuelAlgo(100756));

fsp.readFile('./01-input.txt', { encoding: 'utf-8' })
  .then((input) => {
    return input.split('\n');
  })
  .then((processed) => {
    return processed.filter((i) => {
      return (i !== '');
    });
  })
  .then((modules) => {
    return modules.map((m) => {
      return parseInt(m);
    });
  })
  .then((modules) => {
    return modules.reduce((acc, moduleMass) => {
      let moduleFuel = fuelAlgo(moduleMass);
      return (acc + moduleFuel);
    }, 0);
  })
  .then((total) => {
    console.log(`the total fuel requirements for the spacecraft is ${total}`);
  });


