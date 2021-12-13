const fs = require("fs");
const path = require("path");

const [inputDots, inputFolds] = fs
  //   .readFileSync(path.join(__dirname, "../input/13/exampleDots.txt"))
  .readFileSync(path.join(__dirname, "../input/13/puzzleDots.txt"))
  .toString()
  .split("\n\n");
const dots = inputDots.split("\n").map((line) => line.split(",").map(Number));
const folds = inputFolds
  .split("\n")
  .map((line) => line.replace("fold along ", "").split("="));

const [maxX, maxY] = dots.reduce(
  (previous, current) => {
    if (current[0] > previous[0]) {
      previous[0] = current[0];
    }
    if (current[1] > previous[1]) {
      previous[1] = current[1];
    }
    return previous;
  },
  [0, 0]
);

let grid = [];
for (let y = 0; y <= maxY; y++) {
  grid.push([]);
  for (let x = 0; x <= maxX; x++) {
    grid[y].push(".");
  }
}

dots.forEach(([x, y]) => (grid[y][x] = "#"));

let newGrid = grid;

folds.forEach((firstFold, index) => {
  grid = newGrid;
  newGrid = [];
  const foldTarget = firstFold[0];
  const foldVal = firstFold[1];
  const targetY = foldTarget === "y" ? foldVal : grid.length;
  const targetX = foldTarget === "x" ? foldVal : grid[0].length;

  for (let y = 0; y < targetY; y++) {
    newGrid.push([]);
    const foldedY = foldVal * 2 - y;
    for (let x = 0; x < targetX; x++) {
      const foldedX = foldVal * 2 - x;
      if (
        grid[y][x] === "#" ||
        (foldTarget === "y"
          ? grid[foldedY] && grid[foldedY][x] === "#"
          : grid[y][foldedX] === "#")
      ) {
        newGrid[y].push("#");
      } else {
        newGrid[y].push(".");
      }
    }
  }
  if (index === 0) {
    const res = newGrid.flat().reduce((previous, current) => {
      if (current === "#") {
        return previous + 1;
      }
      return previous;
    }, 0);
    console.log(res);
  }
});
newGrid.forEach((line) => {
  console.log(line.join("").replace(/\./g, " ").replace(/\#/g, "█"));
});
