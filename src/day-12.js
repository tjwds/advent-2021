const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/12/partOne.txt"))
  .toString()
  .split("\n");

const caveNodes = {};

input.forEach((line) => {
  const [start, end] = line.split("-");
  if (!caveNodes[start]) {
    caveNodes[start] = [];
  }
  if (!caveNodes[start].includes(end)) {
    caveNodes[start].push(end);
  }
  if (!caveNodes[end]) {
    caveNodes[end] = [];
  }
  if (start !== "start" && !caveNodes[end].includes(start)) {
    caveNodes[end].push(start);
  }
});

let paths = [];

const canVisitSmall = (cave, smallsVisited) => {
  if (smallsVisited.filter((x) => x === cave).length > 1) {
    return false;
  }
  const smallParts = smallsVisited
    .filter(
      (part) =>
        part !== "start" && part !== "end" && part === part.toLowerCase()
    )
    .sort();
  const numberDupes = smallParts.reduce(
    (previousValue, currentValue, currentIndex) => {
      if (currentValue === smallParts[currentIndex + 1]) {
        return previousValue + 1;
      }
      return previousValue;
    },
    0
  );
  return numberDupes < 1;
};

const visitNode = (visit, argSmallsVisited, currentPath, partTwo) => {
  const nexts = caveNodes[visit] || [];
  nexts.forEach((next) => {
    const pathlen = paths.length;
    if (pathlen !== 0 && pathlen % 100000 === 0) {
      console.log(pathlen);
    }
    const smallsVisited = [...argSmallsVisited];
    if (next !== "end" && next !== "start") {
      if (
        !smallsVisited.includes(next) ||
        (partTwo && canVisitSmall(next, smallsVisited))
      ) {
        if (next === next.toLowerCase()) {
          smallsVisited.push(next);
        }
        visitNode(next, smallsVisited, currentPath + "," + next, partTwo);
      }
    } else if (next === "end") {
      paths.push(currentPath + ",end");
    }
  });
};

visitNode("start", [], "start");
console.log("part one", paths.length);

paths = [];
visitNode("start", [], "start", true);
console.log("part two", paths.length);
