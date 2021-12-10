const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/10/partOne.txt"))
  .toString()
  .split("\n");

let syntaxPoints = 0;
const scores = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};
const partTwoScores = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

const matches = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};
const openers = Object.keys(matches);

// part one
input.forEach(line => {
    const stack = [];
    const characters = line.split("");
    for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        if (openers.includes(char)) {
            stack.push(char);
        } else {
            const match = stack.pop();
            if (matches[match] !== char) {
                syntaxPoints += scores[char];
                return;
            }
        }
    }
});

console.log(syntaxPoints);

// part two
const endScores = [];
input.forEach((line) => {
  const stack = [];
  const characters = line.split("");
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    if (openers.includes(char)) {
      stack.push(char);
    } else {
      const match = stack.pop();
      if (matches[match] !== char) {
        return;
      }
    }
  }
  const endsNeeded = stack.reverse().map((char) => matches[char]);
  const lineScore = endsNeeded.reduce((previous, current) => {
    return previous * 5 + partTwoScores[current];
  }, 0);
  endScores.push(lineScore);
});

console.log(endScores.sort((a, b) => a - b)[(endScores.length - 1) / 2]);
