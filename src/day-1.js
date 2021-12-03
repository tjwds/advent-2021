const fs = require("fs");
const path = require("path");

// const input = fs
//   .readFileSync(path.join(__dirname, "../input/1/example.txt"))
//   .toString();
const input = fs
  .readFileSync(path.join(__dirname, "../input/1/partOne.txt"))
  .toString();

// part one

// let prev = null;
// let counter = 0;

// input
//   .split("\n")
//   .map(Number)
//   .forEach((depth) => {
//     if (prev === null) {
//       prev = depth;
//       return;
//     }

//     if (prev < depth) {
//       counter++;
//     }
//     prev = depth;
//   });

// console.log(counter);

// part two

const inputNums = input.split("\n").map(Number);

const windows = [];
for (let i = 0; i <= inputNums.length; i += 1) {
  windows.push(inputNums[i] + inputNums[i + 1] + inputNums[i + 2]);
}

let prev = null;
let counter = 0;

windows.forEach((depth) => {
  if (prev === null) {
    prev = depth;
    return;
  }

  if (prev < depth) {
    counter++;
  }
  prev = depth;
});

console.log(counter);
