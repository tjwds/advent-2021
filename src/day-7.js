const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/7/partOne.txt"))
  .toString()
  .split(",")
  .map(Number);

const crabsByPosition = {}; // Record of number of days left: number of fish of that era
input.forEach((crab) => {
  if (typeof crabsByPosition[crab] === "undefined") {
    crabsByPosition[crab] = 0;
  }
  crabsByPosition[crab] += 1;
});

const partTwo = true;

const totalFuelToMoveToPositionByIndex = [];
const crabIndexes = Object.keys(crabsByPosition);

for (
  let thisTargetDistance = 0;
  thisTargetDistance <= Math.max(...crabIndexes);
  thisTargetDistance++
) {
  crabIndexes.forEach((crabIndex) => {
    let distanceHere = Math.abs(crabIndex - thisTargetDistance);
    if (partTwo) {
      // https://math.stackexchange.com/a/593320
      distanceHere = (Math.pow(distanceHere, 2) + distanceHere) / 2;
    }
    if (
      typeof totalFuelToMoveToPositionByIndex[thisTargetDistance] ===
      "undefined"
    ) {
      totalFuelToMoveToPositionByIndex[thisTargetDistance] = 0;
    }
    totalFuelToMoveToPositionByIndex[thisTargetDistance] +=
      distanceHere * crabsByPosition[crabIndex];
  });
}

console.log(Math.min(...totalFuelToMoveToPositionByIndex));
