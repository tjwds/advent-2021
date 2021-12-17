/* Ugh, fine, let's do this the old-fashioned way… */

// I might be able to calculate all these values on-demand, but … not going to
// do that.  See all the ??? comments below.

// EXAMPLE

// const inputParameters = {
//   x: (x) => 30 >= x && x >= 20,
//   y: (y) => -5 >= y && y >= -10,
// };
// const passedIt = (x, y) => x > 30 || y < -10;

// const minX = 0;
// const maxX = 30;
// const minY = -10;
// const maxY = 10; // ????? cheating for the example

// INPUT
// target area: x=257..286, y=-101..-57

const inputParameters = {
  x: (x) => 286 >= x && x >= 257,
  y: (y) => -57 >= y && y >= -101,
};
const passedIt = (x, y) => x > 286 || y < -101;

const minX = 0;
const maxX = 286;
const minY = -101;
const maxY = 1000; // ????? cheating

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const test = (x, y) => inputParameters.x(x) && inputParameters.y(y);

let best = {
  a: 0,
  b: 0,
  highestY: 0,
};
let gotEm = 0;

const attempt = (initialA, initialB) => {
  let a = initialA;
  let b = initialB; // https://www.youtube.com/watch?v=Wu5TDEpAqwQ
  let x = 0;
  let y = 0;
  let step = 1;
  let highestY = 0;
  let saidGotEm = false;

  // ??? ugh totally faking this
  while (x <= maxX && x >= minX) {
    x += a;
    y += b;
    a -= a === 0 ? 0 : Math.sign(a);
    b -= 1;

    if (passedIt(x, y)) {
      break;
    }
    if (y > highestY) {
      highestY = y;
    }
    if (test(x, y)) {
      if (!saidGotEm) {
        gotEm += 1;
        saidGotEm = true;
      }
      if (highestY > best.highestY) {
        best = {
          a: initialA,
          b: initialB,
          highestY,
        };
      }
    }

    step += 1;
    if (step > 10000) {
      throw new Error("Something went wrong.");
    }
  }
};

for (let b = minY; b <= maxY; b++) {
  for (let a = minX + 1; a <= maxX; a++) {
    attempt(a, b);
  }
}

console.log(best);
console.log(gotEm)
