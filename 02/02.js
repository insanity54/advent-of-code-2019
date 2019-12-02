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
      console.log(`execute! ${i}`);

      if (this.intcode[i] === 99) break; // 99 means program end
      this.interpretOpcode(this.intcode[i], i);
    }
    return this.intcode;
  }
}

//let exampleIntcodeOne = [ 1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50 ];
//let exampleIntcodeTwo = [ 1, 10, 20, 30 ];
//let exampleIntcodeThree = [ 1, 0, 0, 0, 99 ];
//let exampleIntcodeFour = [ 2, 3, 0, 3, 99 ];
//let exampleIntcodeFive = [ 1, 1, 1, 4, 99, 5, 6, 0, 99 ];


//let oi = new OpcodeInterpreter(exampleIntcodeFour);
//let outputFour = oi.execute();
//let oiTwo = new OpcodeInterpreter(exampleIntcodeFive);
//let outputFive = oiTwo.execute();

//console.log(outputFour);
//console.log(outputFive);





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
    codes[1] = 12;
    codes[2] = 2;
    let oi = new OpcodeInterpreter(codes).execute();
    console.log(oi[0]);
  })
