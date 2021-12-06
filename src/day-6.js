const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/6/partOne.txt"))
  .toString()
  .split(",")
  .map(Number);

let fish = {}; // Record of number of days left: number of fish of that era
input.forEach((fishy) => {
  if (typeof fish[fishy] === "undefined") {
    fish[fishy] = 0;
  }
  fish[fishy] += 1;
});

const numDays = 256;

for (let i = 0; i < numDays; i++) {
  let newFish = {};

  // Each day, a 0 becomes a 6 and adds a new 8 to the end of the list, while each other number decreases by 1 if it was present at the start of the day.
  Object.keys(fish).forEach((era) => {
    let target = Number(era) - 1;
    const numFish = fish[era];

    if (era === "0") {
      target = 6;
      if (typeof newFish["8"] === "undefined") {
        newFish["8"] = numFish;
      } else {
        newFish["8"] += numFish;
      }
    }

    if (typeof newFish[target] === "undefined") {
      newFish[target] = 0;
    }
    newFish[target] += numFish;
  });

  fish = newFish;
}

const numFish = Object.keys(fish).reduce((previous, current) => previous + fish[current], 0)
console.log(numFish);
