const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/5/partOne.txt"))
  .toString()
  .split("\n");

const vents = [];

// lazy
// const maximum = 10;
const maximum = 1001;

for (let y = 0; y < maximum; y++) {
  const row = [];
  for (let x = 0; x < maximum; x++) {
    row.push(0);
  }
  vents.push(row);
}

input.forEach((command) => {
  const [startCommands, endCommands] = command.split(" -> ");
  const start = startCommands.split(",");
  const end = endCommands.split(",");

  let startX = Number(start[0]);
  let startY = Number(start[1]);
  let endX = Number(end[0]);
  let endY = Number(end[1]);

  // to make part one, break glass
  let diagonal = false;
  if (!(startX === endX || startY === endY)) {
    diagonal = true;
  }

  let xDir = endX < startX ? -1 : 1;
  let yDir = endY < startY ? -1 : 1;

  // we want the for loop to run at least once, so extend our inclusive-style
  // range to accommodate for an exclusive-style algorithm.
  endY += yDir;
  endX += xDir;

  why: for (let y = startY; y !== endY; y += yDir) {
    const targetY = vents[y];
    for (let x = startX; x !== endX; x += xDir) {
      targetY[x] += 1;
      if (diagonal) {
          startX += xDir;
          continue why;
      }
    }
  }
});

console.log(
  vents.flat().reduce((previous, next) => {
    if (next > 1) {
      return previous + 1;
    }
    return previous;
  }, 0)
);
