const fs = require("fs");
const path = require("path");

let input = fs
  .readFileSync(path.join(__dirname, "../input/8/partOne.txt"))
  .toString()
  .split("\n");
const targetSegmentLengths = [2, 3, 4, 7];

const uniques = input.reduce((previous, currentLine) => {
  const segments = currentLine.split(" | ")[1].split(" ");
  segments.forEach((segment) => {
    if (targetSegmentLengths.includes(segment.length)) {
      previous += 1;
    }
  });
  return previous;
}, 0);
console.log("part one:", uniques)

/*
 0000
1    2
1    2
 3333
4    5
4    5
 6666
*/
const litSegmentsToNumber = (litSegments) => {
    const litString = JSON.stringify(litSegments);

  for (let i = 0; i < cellConfigurations.length; i++) {
      if (cellStrings[i] === litString) {
          return i;
      }
  }
  return NaN;
};

const cellConfigurations = [
  [0, 1, 2, 4, 5, 6],
  [2, 5],
  [0, 2, 3, 4, 6],
  [0, 2, 3, 5, 6],
  [1, 2, 3, 5],
  [0, 1, 3, 5, 6],
  [0, 1, 3, 4, 5, 6],
  [0, 2, 5],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 5, 6],
];
const cellStrings = cellConfigurations.map(JSON.stringify);

// make a list of all possible segment configurations [a, b, c, d, e, f, g]
// iterate over them all until you find one where litSegmentsToNumber called on
// every cell produces no NaNs
// that's it
// totally based on a random stackoverflow answer and only lightly edited
const generateAllConfigurations = (string) => {
  if (string.length < 2) {
    return string;
  }

  const configurations = [];
  for (let i = 0; i < string.length; i++) {
    const letter = string[i];
    if (string.indexOf(letter) !== i) {
        continue;
    }

    const rest = string.slice(0, i) + string.slice(i + 1, string.length);

    for (let nextConfigs of generateAllConfigurations(rest)) {
        configurations.push(letter + nextConfigs);
    }
  }

  return configurations;
};
const allConfigurations = generateAllConfigurations("abcdefg");

const result = input.reduce((previous, line) => {
  const configurationString = allConfigurations.find((configurationString) => {
    const configuration = configurationString.split("");
    const cells = line.replace(" | ", " ").split(" ");
    return cells.every((cellString) => {
      const cell = cellString.split("");
      const cellConfig = cell.map((letter) => configuration.indexOf(letter));
      return !Number.isNaN(litSegmentsToNumber(cellConfig.sort()));
    });
  });

  const configuration = configurationString.split("");
  const digits = line.split(" | ")[1].split(" ").map(cell => {
      const cellConfig = cell.split("").map((letter) => configuration.indexOf(letter)).sort();
      return litSegmentsToNumber(cellConfig);
  });
  return previous + Number(digits.join(''));
}, 0);
console.log("part two:", result)

// const establishGuarantees = (input) => {
//     for (let i = 2; i <= 7; i++) {
//         const guarantee = input.every(line => line.replace(" | ").split(" ").some(cell => cell.length === i));
//         console.log(`Looks like the assertion that every line has a cell with the length of ${i} is ${guarantee}`);
//     }
// }
// establishGuarantees(input);
