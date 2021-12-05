const fs = require("fs");
const path = require("path");

const draws = fs
  .readFileSync(path.join(__dirname, "../input/4/partOne-draws.txt"))
  .toString()
  .split(",");
const boards = fs
  .readFileSync(path.join(__dirname, "../input/4/partOne-boards.txt"))
  .toString()
  .split("\n\n");
let numberOfCellsHorizontally = boards[0].split("\n")[0].split(" ").length;
let verticalRegexps = [];
for (let i = 0; i < numberOfCellsHorizontally; i++) {
  let everyString = "^ *" + " *[0-9X]+ +".repeat(i) + "X";
  verticalRegexps.push(new RegExp(everyString));
}
const boardsWon = boards.map(() => false);

const checkWinner = (board, boardIndex) => {
  if (/X +X +X +X +X/.test(board.trimStart())) {
      boardsWon[boardIndex] = true;
    return true;
  }

  const rows = board.split("\n");
  for (let i = 0; i < verticalRegexps.length; i++) {
    const vertReg = verticalRegexps[i];
    if (rows.every((row) => vertReg.test(row))) {
        boardsWon[boardIndex] = true;
      return true;
    }
  }

  return false;
};

const calculateWinnerScore = (board, num) => {
  return (
    board
      .replace(/\n/g, " ")
      .replace(/X/g, "")
      .split(" ")
      .reduce((a, b) => {
        return a + Number(b);
      }, 0) * num
  );
};

const draw = (num, index) => {
  // lazy: just replace the number
  boards.forEach((board, index) => {
    boards[index] = board.replace(
      new RegExp(`(^| +|\n)${num}($| +|\n)`),
      "$1X$2"
    );
  });

  // only check boards if it's even possible to have a winner
  if (index > 4) {
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      if (!boardsWon[i] && checkWinner(board, i)) {
            console.log(calculateWinnerScore(board, num));
      }
    }
}
};

for (let i = 0; i < draws.length; i++) {
  const score = draw(draws[i], i);
  if (score) {
    break;
  }
}
