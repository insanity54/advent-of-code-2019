#!/usr/bin/env node

fs = require('fs');
fsp = fs.promises;

let fuelAlgo = (mass) => {
  let f = (Math.floor(mass / 3) - 2);
  if (f < 1) return 0;
  return f;
};

//1969 => (654 => 216 => 70 => 21 => 5) => 966

//var fuel = fuelAlgo(1969);
let moduleFuels = [];
let calcExtraFuels = (acc, mass) => {
  if (mass > 0) {
    let extraFuel = (fuelAlgo(mass));
    return calcExtraFuels((acc+extraFuel), extraFuel);
  }
  else return acc;
}




console.log(calcExtraFuels(0, 14));
console.log(calcExtraFuels(0, 1969));
console.log(calcExtraFuels(0, 100756));

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
      let moduleFuel = calcExtraFuels(0, moduleMass);
      return (acc + moduleFuel);
    }, 0);
  })
  .then((total) => {
    console.log(`the total fuel requirements for the spacecraft is ${total}`);
  });


