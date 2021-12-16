const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/15/input.txt"))
  .toString();

const map = {};
let yLen = 0;
let xLen = 0;
input.split("\n").map((line, y, yArr) => {
  // inefficient but whatever
  if (!yLen) {
    yLen = yArr.length - 1;
  }
  line.split("").map((char, x, xArr) => {
    if (!xLen) {
      xLen = xArr.length - 1;
    }
    map[`${x}#${y}`] = Number(char);
  });
});
const lastId = `${xLen}#${yLen}`;
// console.log(map);

const getAdjacentIds = (id) => {
  const pointsInId = id.split("&");
  const [x, y] = pointsInId[pointsInId.length - 1].split("#").map(Number);
  return [
    //   `${x - 1}#${y}`,
    `${x + 1}#${y}`,
    //   `${x}#${y - 1}`,
    `${x}#${y + 1}`,
  ]
    .filter((id) => map[id] && !pointsInId.includes(id))
    .map((newId) => id + "&" + newId);
};

let points = {
  "0#0": 0,
};

let currentValue = 0;
let leave = false;
while (!leave) {
  // 1. find the node with the lowest score
  const lowest = Math.min(...Object.values(points));
  if (currentValue !== lowest) {
    currentValue = lowest;
    console.log(`on ${lowest}`);
  }
  const pointsKeys = Object.keys(points);
  let lowestKey = pointsKeys.find((id) => points[id] === lowest);

  let nextPoints = {};
  pointsKeys.forEach((id) => {
    if (id !== lowestKey) {
      nextPoints[id] = points[id];
    }
  });

  const adjacents = getAdjacentIds(lowestKey);
  // if no adjacents, make it so we can't use this one
  if (!adjacents.length) {
    nextPoints[lowestKey] = Infinity;
  } else {
    adjacents.map((newId) => {
      const nextKeySplit = newId.split("&");
      const nextKey = nextKeySplit[nextKeySplit.length - 1];
      const targetValue = points[lowestKey] + map[nextKey];
      //   console.log(nextKeySplit, nextKey, lowestKey, points[lowestKey], map[nextKey])
      if (nextKey === lastId) {
        console.log(targetValue);
        leave = true;
      }
      nextPoints[newId] = targetValue;
    });
  }

  points = nextPoints;
}

// I cheated today.
