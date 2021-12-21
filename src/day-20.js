const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/20/input.txt"))
  .toString();

const [imageEnhancementAlgorithmText, inputImageText] = input.split("\n\n");
const imageEnhancementAlgorithm = imageEnhancementAlgorithmText.split("");
const inputImageArr = inputImageText
  .split("\n")
  .map((line) => (line = line.split("")));
const inputImageMap = {};

for (let y = 0; y < inputImageArr.length; y++) {
  for (let x = 0; x < inputImageArr[0].length; x++) {
    inputImageMap[`${x}#${y}`] = inputImageArr[y][x];
  }
}

const getUndefChar = imageEnhancementAlgorithm[0] === "#" ? (iteration) => {
    return iteration % 2 ? "#" : "."
} : () => "."

const getNewPixel = (fromMap, x, y, undefChar) => {
  const surrounding = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  const chars = surrounding.map(
    (coords) => fromMap[`${coords[0]}#${coords[1]}`]
  );

  // also takes care of undef
  const nums = chars.map((char) => {
      if (typeof char === "undefined") {
          char = undefChar
      }
      return char === "#" ? "1" : "0"
    }).join("");
  const digit = parseInt(nums, 2);

  return imageEnhancementAlgorithm[digit];
};

const startY = inputImageArr.length;
const startX = inputImageArr[0].length;

const ITERATIONS = 50;
let nextMap = {};
let previousMap = { ...inputImageMap };

for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    const undefChar = getUndefChar(iteration);
  for (let y = 0 - iteration - 1; y < startY + iteration + 1; y++) {
    for (let x = 0 - iteration - 1; x < startX + iteration + 1; x++) {
      nextMap[`${x}#${y}`] = getNewPixel(previousMap, x, y, undefChar);
    }
  }
  previousMap = { ...nextMap };
  nextMap = {};
}

const numberLit = Object.values(previousMap).reduce(
  (prev, next) => (next === "#" ? prev + 1 : prev),
  0
);

console.log(numberLit);
