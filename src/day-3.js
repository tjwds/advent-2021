const fs = require("fs");
const path = require("path");

// const input = fs
//   .readFileSync(path.join(__dirname, "../input/3/example.txt"))
//   .toString()
//   .split("\n");
const input = fs
  .readFileSync(path.join(__dirname, "../input/3/partOne.txt"))
  .toString()
  .split("\n");

const partOne = (input) => {
  const positions = Array.from(input[0]).fill(0);
  input.forEach((line) => {
    line.split("").forEach((character, index) => {
      if (character === "1") {
        positions[index] += 1;
      }
    });
  });

  const target = input.length / 2;
  const gamma = parseInt(
    positions.reduce(
      (previous, current) => (previous += current > target ? "1" : "0"),
      ""
    ),
    2
  );
  // probably a bitwise operator way to calculate this but I'm tired
  const epsilon = parseInt(
    positions.reduce(
      (previous, current) => (previous += current > target ? "0" : "1"),
      ""
    ),
    2
  );

  return gamma * epsilon;
};

const partTwo = (input) => {
  let oxGen = 0;
  let calculatingOxGen = true;
  let bitConsidered = 0;
  let working = [...input];

  while (true) {
    const halfLength = working.length / 2;
    let onesInOnes = working.reduce((previous, current) => {
      if (current[bitConsidered] === "1") {
        previous += 1;
      }
      return previous;
    }, 0);
    let useOne = onesInOnes >= halfLength;

    if (!calculatingOxGen) {
      useOne = !useOne;
    }

    working = working.filter(
      (value) => value[bitConsidered] === (useOne ? "1" : "0")
    );

    bitConsidered++;

    if (working.length === 1) {
      if (calculatingOxGen) {
        calculatingOxGen = false;
        oxGen = parseInt(working[0], 2);
        working = [...input];
        bitConsidered = 0;
      } else {
        return oxGen * parseInt(working[0], 2);
      }
    }

    if (bitConsidered === working[0].length) {
      throw new Error("Exceeded length of input.");
    }
  }
};

console.log(partTwo(input));
