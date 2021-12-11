const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/11/partOne.txt"))
  .toString()
  .split("\n");

// let's do this michael-style
const octopi = {};
input.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    octopi[`${x}#${y}`] = Number(char);
  });
});

const calculateAdjacentKeys = (key) => {
  const [x, y] = key.split("#").map(Number);

  return [
    `${x - 1}#${y - 1}`,
    `${x}#${y - 1}`,
    `${x + 1}#${y - 1}`,
    `${x - 1}#${y}`,
    //   `${x}#${y}`,
    `${x + 1}#${y}`,
    `${x - 1}#${y + 1}`,
    `${x}#${y + 1}`,
    `${x + 1}#${y + 1}`,
  ].filter((key) => typeof octopi[key] === "number");
};

let totalFlashes = 0;
let cycle = 1;
let flashedThisCycle = [];

const brightenOctopus = (key) => {
  octopi[key] += 1;
};

const exhaustOctopus = (key) => {
  octopi[key] = 0;
};

const flashOctopus = (key) => {
  if (octopi[key] > 9 && !flashedThisCycle[key]) {
    flashedThisCycle[key] = true;
    octopi[key] = 0;
    totalFlashes++;
    const adjacentKeys = calculateAdjacentKeys(key);
    adjacentKeys.forEach(brightenOctopus);
    adjacentKeys.forEach(flashOctopus);
  }
};

const flashOctopuses = () => {
  const octopiKeys = Object.keys(octopi);
  octopiKeys.forEach(brightenOctopus);
  octopiKeys.forEach(flashOctopus);
  keysFlashedThisCycle = Object.keys(flashedThisCycle);
  keysFlashedThisCycle.forEach(exhaustOctopus);
  if (cycle === 100) {
    console.log("part one", totalFlashes);
  }
  if (keysFlashedThisCycle.length === octopiKeys.length) {
    console.log("part two", cycle);
    return false;
  }
  flashedThisCycle = [];
  cycle++;
  return true;
};

while (flashOctopuses()) {} // never do this
