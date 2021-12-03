const fs = require("fs");
const path = require("path");

// const input = fs
//   .readFileSync(path.join(__dirname, "../input/2/example.txt"))
//   .toString()
//   .split('\n');
const input = fs
  .readFileSync(path.join(__dirname, "../input/2/partOne.txt"))
  .toString()
  .split("\n");

const partOne = function (input, partTwo = false) {
  const position = {
    depth: 0,
    horizontal: 0,
    aim: 0,
  };

  input.forEach((commandLine) => {
    const command = commandLine.split(" ");
    if (command[0] === "forward") {
      position.horizontal += Number(command[1]);
      if (partTwo) {
        position.depth += position.aim * Number(command[1]);
      }
    } else if (command[0] === "down") {
        if (partTwo) {
            position.aim += Number(command[1]);
        } else {
            position.depth += Number(command[1]);
        }
    } else if (command[0] === "up") {
      if (partTwo) {
        position.aim -= Number(command[1]);
      } else {
        position.depth -= Number(command[1]);
      }
    }
  });

  return position.depth * position.horizontal;
};

console.log(partOne(input, true));
