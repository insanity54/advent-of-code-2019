#!/usr/bin/env node

"use strict";

const fs = require('fs');
const fsp = fs.promises;

class OpcodeInterpreter {
  constructor (intcode) {
    this.intcode = intcode;
    this.opcode = null;
    return this;
  }
  interpretOpcode(n, idx) {
    if (n === 1) {
      this.opcodeOne(
        this.intcode[idx+1],
        this.intcode[idx+2],
        this.intcode[idx+3]
      )
    }
    else if (n === 2) {
      this.opcodeTwo(
        this.intcode[idx+1],
        this.intcode[idx+2],
        this.intcode[idx+3]
      )
    }
  }
  opcodeOne(n1, n2, n3) {
    let q1 = this.intcode[n1];
    let q2 = this.intcode[n2];
    let q3 = (q1 + q2);
    this.intcode[n3] = q3;
  }
  opcodeTwo(n1, n2, n3) {
    let q1 = this.intcode[n1];
    let q2 = this.intcode[n2];
    let q3 = (q1 * q2);
    this.intcode[n3] = q3;
  }
  execute() {
    for (var i = 0; i < this.intcode.length; i += 4) {
      // console.log(`execute! ${i}`);

      if (this.intcode[i] === 99) break; // 99 means program end
      this.interpretOpcode(this.intcode[i], i);
    }
    return this.intcode;
  }
}

// greetz https://stackoverflow.com/a/7228322/1004931
function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

fsp.readFile('./02-input.txt', { encoding: 'utf-8' })
  .then((input) => {
    return input.split(',');
  })
  .then((inputStrings) => {
    return inputStrings.map((itm) => parseInt(itm))
  })
  .then((processed) => {
    return processed.filter((i) => {
      return (typeof i !== 'undefined');
    });
  })
  .then((codes) => {
    let output = null;
    while (output !== 19690720) {
      let noun = randomIntFromInterval(0, 99);
      let verb = randomIntFromInterval(0, 99);
      codes[1] = noun;
      codes[2] = verb;
      let oi = new OpcodeInterpreter(JSON.parse(JSON.stringify(codes)))
      let exec = oi.execute();
      output = exec[0];
      console.log(`output:${output}. noun:${noun}, verb:${verb}. 100*noun+verb:${100*noun+verb}`);
    }
  })
