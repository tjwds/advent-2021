/*
 _____ _     _
/__   \ |__ (_)___
  / /\/ '_ \| / __|
 / /  | | | | \__ \
 \/   |_| |_|_|___/

 _
(_)___   ___  ___
| / __| / __|/ _ \
| \__ \ \__ \ (_) |     I can't think of the reason why I want to include this
|_|___/ |___/\___/      obviously-broken code in my permanent record of my
                        efforts to conquer Advent of Code this year, but here
     _ _ _              you go.
 ___(_) | |_   _
/ __| | | | | | |
\__ \ | | | |_| |
|___/_|_|_|\__, |
           |___/
*/

const fs = require("fs");
const path = require("path");

// const input = fs
//   .readFileSync(path.join(__dirname, "../input/16/example.txt"))
//   .toString();

const inputs = [
  //   "EE00D40C823060",
  //
  // "8A004A801A8002F478",
  "620080001611562C8802118E34",
  // "C0015000016115A2E0802F182340",
  // "A0016C880162017C3686B18A3D4780"
];

const hexToBinary = (hex) =>
  Number.parseInt(hex, 16).toString(2).padStart(4, "0");
const binaryToDecimal = (binary) => Number.parseInt(binary, 2);

const NEED_PACKET_VERSION = 0;
const NEED_PACKET_TYPE = 1;

const NEED_LITERAL = 2;
const IGNORE_TRAILING_ZEROS = 3;

const NEED_LENGTH_TYPE = 4;

const NEED_0_OPERATOR_LENGTH_VALUE = 5;
const READ_0_OPERATOR_VALUE = 6;

const NEED_1_OPERATOR_LENGTH_VALUE = 7;
const READ_1_OPERATOR_VALUE = 8;

const IGNORE_TRAILING_TYPE_ZERO_ZEROES = 9;

const ARGH = [
  "NEED_PACKET_VERSION",
  "NEED_PACKET_TYPE",
  "NEED_LITERAL",
  "IGNORE_TRAILING_ZEROS",
  "NEED_LENGTH_TYPE",
  "NEED_0_OPERATOR_LENGTH_VALUE",
  "READ_0_OPERATOR_VALUE",
  "NEED_1_OPERATOR_LENGTH_VALUE",
  "READ_1_OPERATOR_VALUE",
  "IGNORE_TRAILING_TYPE_ZERO_ZEROES",
];

// going off the rails a bit here
let type0TrailingRemaining = [];

inputs.forEach((input) => {
  let mode = NEED_PACKET_VERSION;
  const binaryString = input.split("").map(hexToBinary).join("");
  //   console.log(binaryString);
  const queue = binaryString.split("").reverse();
  let register = [];
  let registerTwo = 0;
  let versionNumberTotal = 0;

  const changeMode = (id) => {
    register = [];
    mode = id;
    console.log("let's go to", ARGH[id], id);
  };

  while (queue.length) {
    const peek = queue.pop();
    if (type0TrailingRemaining.length) {
      type0TrailingRemaining[type0TrailingRemaining.length - 1] -= 1;
    }
    if (mode === NEED_PACKET_VERSION || mode === NEED_PACKET_TYPE) {
      register.push(peek);
      if (register.length === 3) {
        const value = binaryToDecimal(register.join(""));
        if (mode === NEED_PACKET_VERSION) {
          console.log("");
          console.log("got version", value);
          versionNumberTotal += value;
          changeMode(NEED_PACKET_TYPE);
        } else {
          if (value === 4) {
            registerTwo = 0;
            changeMode(NEED_LITERAL);
          } else {
            changeMode(NEED_LENGTH_TYPE);
          }
        }
      }
    } else if (mode === NEED_LITERAL) {
      register.push(peek);
      registerTwo += 1;
      if (register.length === 5) {
        // part one:  just decide whether or not we're continuing
        if (register[0] === "0") {
          changeMode(IGNORE_TRAILING_ZEROS);
        } else {
          register = [];
        }
      }
    } else if (mode === IGNORE_TRAILING_ZEROS) {
      if (peek === "1" || registerTwo % 4) {
        // eww, put it back!!!
        queue.push(peek);
        if (type0TrailingRemaining.length) {
          changeMode(IGNORE_TRAILING_TYPE_ZERO_ZEROES);
        } else {
          changeMode(NEED_PACKET_VERSION);
        }
      }
      registerTwo += 1;
      //   console.log("ignoring zeros", registerTwo, registerThree);
    } else if (mode === IGNORE_TRAILING_TYPE_ZERO_ZEROES) {
      if (!type0TrailingRemaining[type0TrailingRemaining.length - 1]) {
        type0TrailingRemaining.pop();
        if (!type0TrailingRemaining.length) {
          changeMode(NEED_PACKET_VERSION);
        }
      }
    } else if (mode === NEED_LENGTH_TYPE) {
      const lengthType = peek;
      console.log("got length type", lengthType);
      if (lengthType === "1") {
        changeMode(NEED_1_OPERATOR_LENGTH_VALUE);
      } else {
        changeMode(NEED_0_OPERATOR_LENGTH_VALUE);
      }
    } else if (mode === NEED_0_OPERATOR_LENGTH_VALUE) {
      register.push(peek);
      if (register.length === 15) {
        type0TrailingRemaining.push(binaryToDecimal(register.join("")));
        // changeMode(READ_0_OPERATOR_VALUE); // TODO wat
        // changeMode(IGNORE_TRAILING_ZEROS);
        changeMode(NEED_PACKET_VERSION);
      }
    } else if (mode === READ_0_OPERATOR_VALUE) {
      // part one says we should just ignore these
      register.push(peek);
      if (register.length === registerTwo) {
        // TODO max length to ignore
        changeMode(NEED_PACKET_VERSION);
      }
    } else if (mode === NEED_1_OPERATOR_LENGTH_VALUE) {
      register.push(peek);
      if (register.length === 11) {
        // Really, we can just skip considering whether or not these values
        // are nested for part one…
        // registerTwo = binaryToDecimal(register.join(""));
        // registerThree = 0;
        // TODO max length to ignore
        // what??? this is so unclear...
        // registerTwo = 2;
        // registerThree = 0;
        changeMode(NEED_PACKET_VERSION);
      }
    } else if (mode === READ_1_OPERATOR_VALUE) {
      // TODO
      //   changeMode(NEED_PACKET_VERSION)
    }
  }

  console.log(versionNumberTotal);
});
