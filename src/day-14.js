const fs = require("fs");
const path = require("path");

const [startPolymer, polymerInput] = fs
  .readFileSync(path.join(__dirname, "../input/14/input.txt"))
  .toString()
  .split("\n\n");

const polymerMap = {};
polymerInput.split("\n").forEach((line) => {
  const entries = line.split(" -> ");
  polymerMap[entries[0]] = entries[1];
});

// const polymerize = (input) => {
//     let resultString = '';
//     const chars = input.split("");
//     chars.forEach((char, index) => {
//         const nextChar = chars[index + 1];
//         if (nextChar) {
//             const resPolymer = polymerMap[char + nextChar];
//             resultString += char + resPolymer;
//         } else {
//             resultString += char;
//         }
//     });

//     return resultString;
// }

const createPolymerGroups = (string) => {
  let resultGroups = {};
  const chars = string.split("");
  chars.forEach((char, index) => {
    const nextChar = chars[index + 1];
    if (nextChar) {
      if (!resultGroups[char + nextChar]) {
        resultGroups[char + nextChar] = 0;
      }
      resultGroups[char + nextChar] += 1;
    }
  });

  return resultGroups;
};
const polymerizeGroups = (polymerGroups) => {
  const resultGroups = {};
  Object.keys(polymerGroups).forEach((polymer) => {
    const nextPolymer = polymerMap[polymer];
    const polymerChars = polymer.split("");
    const thesePolymers = [
      polymerChars[0] + nextPolymer,
      nextPolymer + polymerChars[1],
    ];
    const polymerValue = polymerGroups[polymer];
    thesePolymers.forEach((addPolymer) => {
      if (!resultGroups[addPolymer]) {
        resultGroups[addPolymer] = 0;
      }
      resultGroups[addPolymer] += polymerValue;
    });
  });

  return resultGroups;
};

let polymerGroups = createPolymerGroups(startPolymer);
for (let i = 0; i < 40; i++) {
  polymerGroups = polymerizeGroups(polymerGroups);
}
// console.log(polymerGroups);

let numChars = {};
Object.keys(polymerGroups).forEach((polymer) => {
  const chars = polymer.split("");
  const numPolymerChar = polymerGroups[polymer];
  chars.forEach((char) => {
    if (!numChars[char]) {
      numChars[char] = 0;
    }
    numChars[char] += numPolymerChar;
  });
});

// the first and last characters always get an extra point
const startPolymerChars = startPolymer.split("");
numChars[startPolymerChars[0]] += 1;
numChars[startPolymerChars[startPolymerChars.length - 1]] += 1;
// console.log(numChars);

let min = Infinity;
let max = 0;
Object.values(numChars).forEach((startNumber) => {
  const number = startNumber / 2;
  if (number < min) {
    min = number;
  }
  if (number > max) {
    max = number;
  }
});

// const entries = {};
// polymerString.split('').forEach(char => {
//     if (!entries[char]) {
//         entries[char] = 0;
//     }
//     entries[char] += 1;
// });

// let min = Infinity;
// let max = 0;
// Object.values(entries).forEach(number => {
//     if (number < min) {
//         min = number;
//     }
//     if (number > max) {
//         max = number;
//     }
// })

console.log(max - min);
