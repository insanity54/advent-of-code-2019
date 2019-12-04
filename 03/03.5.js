#!/usr/bin/env node

"use strict";

const fs = require('fs');
const fsp = fs.promises;
const { testIt } = require('../util/util');

let loadInput = (filename) => {
  return fsp.readFile(filename, { encoding: 'utf-8' })
    .then((input) => {
      return input
        .split('\n')
        .filter((i) => (i !== ''))
        .map((line) => line.split(','));
    })
  }

/*
  # Terminology

  wireInstructions: [ [ ... ], [ ... ] ];
  wireInstruction: R8, U5, L5, D3
  direction: R, U, L, or D
  distance: 8, 5, 5, 3
  wireRoute: [ [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], ... ]
*/


let computeWireRoute = (wireInstruction) => {
  let wireRoute = [[0, 0]];
  wireInstruction.forEach((instruction) => {
    let direction = instruction[0];
    let distance = instruction.substr(1);

    // compute the intermediate steps
    switch (direction) {
      case 'U':
        for (var i = 0; i < distance; i++) {
          let lastPosition = wireRoute[wireRoute.length-1];
          let lastX = lastPosition[0];
          let lastY = lastPosition[1];
          let nextX = lastX;
          let nextY = lastY + 1;
          let nextPosition = [nextX, nextY];
          wireRoute.push(nextPosition);
        }
        break;
      case 'D':
        for (var i = 0; i < distance; i++) {
          let lastPosition = wireRoute[wireRoute.length-1];
          let lastX = lastPosition[0];
          let lastY = lastPosition[1];
          let nextX = lastX;
          let nextY = lastY - 1;
          let nextPosition = [nextX, nextY];
          wireRoute.push(nextPosition);
        }
        break;
      case 'R':
        for (var i = 0; i < distance; i++) {
          let lastPosition = wireRoute[wireRoute.length-1];
          let lastX = lastPosition[0];
          let lastY = lastPosition[1];
          let nextX = lastX + 1;
          let nextY = lastY;
          let nextPosition = [nextX, nextY];
          wireRoute.push(nextPosition);
        }
        break;
      case 'L':
        for (var i = 0; i < distance; i++) {
          let lastPosition = wireRoute[wireRoute.length-1];
          let lastX = lastPosition[0];
          let lastY = lastPosition[1];
          let nextX = lastX - 1;
          let nextY = lastY;
          let nextPosition = [nextX, nextY];
          wireRoute.push(nextPosition);
        }
        break;
    }
  });
  return wireRoute;
}

let plotMap = (wireRoutes) => {
  let map = [
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
  ];
  let plotIconOnMap = (xPos, yPos, character) => {
    // [0, 0] equates to map[map.length-1][0]
    map[yPos][xPos] = character;
  }
  wireRoutes.forEach((wireRoute) => {
    wireRoute.forEach((position) => {
      let x = position[0];
      let y = position[1];
      plotIconOnMap(x, y, '+');
    });
  });
  map.forEach((row) => {
    // console.log(row);
    console.log(row.join(''));
  })
}


let computeWireRoutes = (wireInstructions) => {
  let wireRoutes = [];
  wireInstructions.forEach((wireInstruction) => {
    wireRoutes.push(computeWireRoute(wireInstruction));
  });
  return wireRoutes;
}


let computeCrossPoints = (wireRoutes) => {
  // change the position arrays to strings so we can use Array.includes()
  // I feel dirty
  let wireOneRoute = wireRoutes[0].map((pos) => String(`${pos[0]},${pos[1]}`));
  let wireTwoRoute = wireRoutes[1].map((pos) => String(`${pos[0]},${pos[1]}`));

  let crossPoints = wireOneRoute.filter(pos => {
    return (
      pos !== '0,0' &&
      wireTwoRoute.includes(pos)
    )
  });
  let cp = crossPoints.map((pos) => {
    let p = pos.split(',');
    return [parseInt(p[0]), parseInt(p[1])];
  });
  return cp;
}

let getClosestCross = (crossPoints) => {
  let closestCross;
  crossPoints.forEach((crossPoint) => {
    let crossX = crossPoint[0];
    let crossY = crossPoint[1];
    let crossXabs = Math.abs(crossX);
    let crossYabs = Math.abs(crossY);
    if (typeof closestCross === 'undefined') {
      closestCross = [crossX, crossY];
    } else {
      let closestCrossX = closestCross[0];
      let closestCrossY = closestCross[1];
      let closestCrossXabs = Math.abs(closestCrossX);
      let closestCrossYabs = Math.abs(closestCrossY);
      if (
        (closestCrossXabs + closestCrossYabs) >
        (crossXabs + crossYabs)
      ) {
        closestCross = [crossX, crossY];
      }
    }
  });
  return closestCross;
}


let computeManhattanDistance = (startPosition, endPosition) => {
  let startX = startPosition[0];
  let startY = startPosition[1];
  let endX = endPosition[0];
  let endY = endPosition[1];
  let manhattanDistance = (Math.abs(endX) + Math.abs(endY));
  return manhattanDistance;
}


let computeDistancesToCrosses = (wireRoutes, crossPoints) => {
  let distances = [[],[]];
  crossPoints.forEach((crossPoint) => {
    let crossX = crossPoint[0];
    let crossY = crossPoint[1];
    wireRoutes.forEach((wireRoute, wireRouteIdx) => {
      wireRoute.forEach((step, i) => {
        // console.log(`step ${step} (${typeof step}) [${step[0]}]`);
        let stepX = step[0];
        let stepY = step[1];
        // console.log(`comparing ${stepX} to ${crossX}, ${stepY} to ${crossY}`);
        if (
          stepX === crossX &&
          stepY === crossY
        )
        distances[wireRouteIdx].push(i);
      });
    });
  });
  let d = distances[0].map((distance, i) => {
    return (distance+distances[1][i]);
  });
  return d.sort((a, b) => a - b)
}


let getManhattanDistanceToClosestIntersection = (wireInstructions) => {
  let wireRoutes = computeWireRoutes(wireInstructions);
  let crossPoints = computeCrossPoints(wireRoutes);
  let wireRoutesDistance = computeDistancesToCrosses(wireRoutes, crossPoints);
  console.log(wireRoutesDistance)
  return wireRoutesDistance[0];
}


// loadInput('./03.5-example-input-1.txt').then((wireInstructions) => {
//   let output = testIt(getManhattanDistanceToClosestIntersection(wireInstructions), 610);
//   console.log(output);
// });
//
// loadInput('./03.5-example-input-2.txt').then((wireInstructions) => {
//   let output = testIt(getManhattanDistanceToClosestIntersection(wireInstructions), 410);
//   console.log(output);
// });

loadInput('./03-input.txt').then((wireInstructions) => {
  let output = getManhattanDistanceToClosestIntersection(wireInstructions);
  console.log(output);
});
