// let playerOnePosition = 4;
let playerOnePosition = 8;
let playerOneScore = 0;
// let playerTwoPosition = 8;
let playerTwoPosition = 4;
let playerTwoScore = 0;
let playerOneTurn = true;
let diceRolls = 0;

for (let die = 0;;) {
  for (let i = 1; i <= 3; i++) {
    die = die + 1;
    if (playerOneTurn) {
      playerOnePosition = (playerOnePosition + die) % 10;
    } else {
      playerTwoPosition = (playerTwoPosition + die) % 10;
    }
    if (die === 100) {
      die = 0;
    }
  }

  diceRolls += 3;

  if (playerOneTurn) {
      if (!playerOnePosition) {
          playerOneScore += 10
      } else {
          playerOneScore += playerOnePosition;
      }

      if (playerOneScore >= 1000) {
          console.log(`dice rolls: ${diceRolls}`)
          console.log(`losing player (two) score: ${playerTwoScore}`);
          console.log(diceRolls * playerTwoScore);
          break;
      }
  } else {
    if (!playerTwoPosition) {
        playerTwoScore += 10
    } else {
        playerTwoScore += playerTwoPosition;
    }

    if (playerTwoScore >= 1000) {
        console.log(`dice rolls: ${diceRolls}`)
        console.log(`losing player (one) score: ${playerOneScore}`);
        console.log(diceRolls * playerOneScore);
        break;
    }
  }
  playerOneTurn = !playerOneTurn;
}
