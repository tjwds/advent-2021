const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/16/input.txt"))
  .toString();
// const input = "9C0141080250320F1802104A08"

const hexToBinary = (hex) =>
  Number.parseInt(hex, 16).toString(2).padStart(4, "0");
const binaryToDecimal = (binary) => Number.parseInt(binary, 2);

let versionNumberTotal = 0;

const typeIdToFunction = (typeId) => {
  switch (typeId) {
    case 0:
      return (...args) => args.reduce((a, b) => a + b, 0);
    case 1:
      return (...args) => args.reduce((a, b) => a * b, 1);
    case 2:
      return (...args) => Math.min(...args);
    case 3:
      return (...args) => Math.max(...args);
    // lol 4
    case 5:
      return (arg1, arg2) => (arg1 > arg2 ? 1 : 0);
    case 6:
      return (arg1, arg2) => (arg1 < arg2 ? 1 : 0);
    case 7:
      return (arg1, arg2) => (arg1 === arg2 ? 1 : 0);
  }
};

const parsePacket = (binaryString) => {
  console.log("called parsePacket with", binaryString);
  // get the version number and type ID.
  const versionNumber = binaryToDecimal(binaryString.slice(0, 3));
  const typeId = binaryToDecimal(binaryString.slice(3, 6));
  console.log("fooooooooo", versionNumber, typeId);
  versionNumberTotal += versionNumber;
  let binaryInput = binaryString.slice(6);

  if (typeId === 4) {
    console.log("LITERAL");
    let chars = binaryInput.split("").reverse();
    const number = [];
    let processedNumbers = 0;
    let ignoreAfterThisLoop = false;
    while (chars.length) {
      let char = chars.pop();
      if (!(processedNumbers % 5)) {
        console.log(
          "okay we're checking to see if this is the last one segment of five for this literal",
          number,
          char
        );
        if (ignoreAfterThisLoop) {
          chars.push(char);
          console.log("NOW WE IGNORE THE REST", chars);
          break;
        } else if (char === "0") {
          ignoreAfterThisLoop = true;
        }
      } else {
        number.push(char);
      }
      processedNumbers += 1;
    }

    const resultNumber = binaryToDecimal(number.join(""));
    console.log("THE NUMBER REPRESENTED BY THIS LITERAL IS", resultNumber);
    console.log("WHAT REMAINS IS", chars);
    if (chars.length) {
      // TODO this is probably wrong?
      const answer = chars.reverse().join("");
      console.log("returning", answer);
      return [answer, resultNumber];
    }
    console.log("returning nothing");
    return ["", resultNumber];
  } else {
    // Parse the packets contained by this one.
    const lengthTypeId = binaryInput.slice(0, 1);
    binaryInput = binaryInput.slice(1);
    // I know this is verbose but I'm on hour four of this problem right now.
    if (lengthTypeId === "0") {
      console.log("ZERO OPERATOR");
      const packetLength = binaryToDecimal(binaryInput.slice(0, 15));
      binaryInput = binaryInput.slice(15);
      let thisInput = binaryInput.slice(0, packetLength);
      const resultNumbers = [];
      while (thisInput) {
        const [remainingInput, resultNumber] = parsePacket(thisInput);
        resultNumbers.push(resultNumber);
        thisInput = remainingInput;
      }
      console.log("WAIT WHAT", typeId);
      return [
        binaryInput.slice(packetLength),
        typeIdToFunction(typeId)(...resultNumbers),
      ];
    } else {
      console.log("ONE OPERATOR");
      const packetLength = binaryToDecimal(binaryInput.slice(0, 11));
      binaryInput = binaryInput.slice(11);
      const resultNumbers = [];
      for (let i = 0; i < packetLength; i++) {
        console.log("here", i, packetLength);
        const [remainingInput, resultNumber] = parsePacket(binaryInput);
        resultNumbers.push(resultNumber);
        binaryInput = remainingInput;
      }
      console.log("WAIT WHAT 1", typeId);
      return [binaryInput, typeIdToFunction(typeId)(...resultNumbers)];
    }
  }
};
const binaryString = input.split("").map(hexToBinary).join("");
console.log("HERE IS THE PART TWO ANSWER", parsePacket(binaryString)[1]);
console.log("THE VERSION SUM IS", versionNumberTotal);
