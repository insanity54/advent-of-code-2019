#!/usr/bin/env node

"use strict";

const { testIt, loadInput } = require('../util/util');


/**
   password specs
   6 digit number
   value is >= 245318
   value is <= 765747
   two adjacent digits are the same
   left to right, digits never decrease
 */

let isSixDigits = (number) => {
  // greetz https://stackoverflow.com/a/14879700/1004931
  let length = Math.log(number) * Math.LOG10E + 1 | 0;
  return (length === 6) ? true : false;
}

let hasOneAdjacentPair = (number) => {

  let registerNumber = (numberCounts, number) => {
    if (typeof numberCounts[number] === 'undefined') numberCounts[number] = 1;
    else numberCounts[number] += 1;
  }
  let numberString = String(number);
  let numberCounts = {};
  for (var i = 0; i < numberString.length; i ++) {
    registerNumber(numberCounts, numberString[i]);
  }
  // console.log(numberCounts);
  let isAtLeastOnePair = false;
  for (let key in numberCounts) {
    if (numberCounts[key] === 2) {
      isAtLeastOnePair = true;
      break;
    }
  }
  return isAtLeastOnePair;
}

let hasNeverDecreasingDigits = (number) => {
  let numberString = String(number);
  let isInvalid = true;
  for (var i = 0; i < numberString.length; i ++) {
    if (i === 0) continue;
    let thisN = parseInt(numberString[i]);
    let lastN = parseInt(numberString[i-1]);
    if (thisN < lastN) {
      isInvalid = false;
      break;
    }
  }
  return isInvalid;
}

let isValidPassword = (number) => {
  if (
    isSixDigits(number) &&
    hasOneAdjacentPair(number) &&
    hasNeverDecreasingDigits(number)
  ) return true;
  else return false;
}

let findValidPasswords = (range) => {
  let r = range.split('-');
  let lowest = parseInt(r[0]);
  let highest = parseInt(r[1]);
  let validPasswords = [];
  console.log(`highest:${highest}, lowest:${lowest}`)
  for (var pp = lowest; pp <= highest; pp ++) {
    if (isValidPassword(pp)) validPasswords.push(pp);
  }
  console.log(`lowest valid pw:${validPasswords[0]}, highest valid pw:${validPasswords[validPasswords.length-1]}`)
  return validPasswords;
}

// testIt(isValidPassword(111111), false);
// testIt(isValidPassword(223450), false);
// testIt(isValidPassword(123789), false);
//
// testIt(isValidPassword(112233), true);
// testIt(isValidPassword(123444), false);
// testIt(isValidPassword(111122), true);
// testIt(isValidPassword(124444), false);


loadInput('./04-input.txt').then((range) => {
  let output = findValidPasswords(range[0][0]);
  console.log(output.length);
});
