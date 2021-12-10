const fs = require("fs");
const path = require("path");

let input = fs
  .readFileSync(path.join(__dirname, "../input/9/partOne.txt"))
  .toString()
  .split("\n")
  .map((row) => row.split("").map(Number));

let risk = 0;

// for (let y = 0; y < input.length; y++) {
//   for (let x = 0; x < input[0].length; x++) {
//     let hasLowerNeighbor = false;
//     let cell = input[y][x];
//     if (x !== 0 && cell >= input[y][x - 1]) {
//       hasLowerNeighbor = true;
//     }
//     // probably a much clearer way to express this but I'm tired
//     if (
//       !hasLowerNeighbor &&
//       x !== input[0].length - 1 &&
//       cell >= input[y][x + 1]
//     ) {
//       hasLowerNeighbor = true;
//     }
//     if (!hasLowerNeighbor && y !== 0 && cell >= input[y - 1][x]) {
//       hasLowerNeighbor = true;
//     }
//     if (
//       !hasLowerNeighbor &&
//       y !== input.length - 1 &&
//       cell >= input[y + 1][x]
//     ) {
//       hasLowerNeighbor = true;
//     }

//     if (!hasLowerNeighbor) {
//       risk += 1 + cell;
//     }
//   }
// }
// console.log("part one", risk);

let basinMap = [];
let nextGroupNumber = 1;
for (let y = 0; y < input.length; y++) {
  basinMap.push([]);
  for (let x = 0; x < input[0].length; x++) {
    let cell = input[y][x];
    if (cell === 9) {
      basinMap[y].push(null);
    } else {
      if (x !== 0 && input[y][x - 1] !== 9) {
        basinMap[y].push(basinMap[y][x - 1]);
        continue;
      }
      // if (!hasNeighbor && x !== input[0].length - 1 && input[y][x + 1] !== 9) {
      //   hasNeighbor = true;
      // }
      if (y !== 0 && input[y - 1][x] !== 9) {
        basinMap[y].push(basinMap[y - 1][x]);
        continue;
      }
      // if (!hasNeighbor && y !== input.length - 1 && cell >= input[y + 1][x]) {
      //   hasNeighbor = true;
      // }

      basinMap[y].push(nextGroupNumber);
      nextGroupNumber += 1;
    }
  }
}

// TODO omg okay
// for every cell (n), look at all the adjacent numbers (m[])
// if there's one that's lower, replace every instance of n with the lowest m
// do this until we can't do it anymore
// buggy answer left below for posterity
outer: while (true) {
  for (let y = 0; y < basinMap.length; y++) {
    for (let x = 0; x < basinMap[0].length; x++) {
      const cell = basinMap[y][x];
      if (cell) {
        let adjacent;
        if (y !== 0) {
          const adjacentCell = basinMap[y - 1][x];
          if (adjacentCell && adjacentCell < cell) {
            adjacent = adjacentCell;
          }
        }
        if (y < basinMap.length - 1) {
            const adjacentCell = basinMap[y + 1][x];
            if (
              adjacentCell &&
              adjacentCell < cell &&
              (!adjacent || adjacentCell < adjacent)
            ) {
              adjacent = adjacentCell;
            }
        }
        if (x !== 0) {
          const adjacentCell = basinMap[y][x - 1];
          if (
            adjacentCell &&
            adjacentCell < cell &&
            (!adjacent || adjacentCell < adjacent)
          ) {
            adjacent = adjacentCell;
          }
        }
        if (x < basinMap[0].length - 1) {
          const adjacentCell = basinMap[y][x + 1];
          if (
            adjacentCell &&
            adjacentCell < cell &&
            (!adjacent || adjacentCell < adjacent)
          ) {
            adjacent = adjacentCell;
          }
        }

        if (adjacent) {
            basinMap = basinMap.map(y => y.map(x => {
                return x === cell ? adjacent : x
            }));
            continue outer;
        }
      }
    }
  }
  break;
}
console.log(JSON.stringify(basinMap.map(y => y.map(x => String(x || 0).padStart(3, "0")))).replace(/\],\[/g, "],\n  ["))
// count the number of each number
const resMap = basinMap.flat();
const areaIdByVolume = {};
resMap.forEach(cell => {
    if (typeof cell === 'number') {
        if (!areaIdByVolume[cell]) {
          areaIdByVolume[cell] = 0;
        }
        areaIdByVolume[cell] += 1;
    }
})

// get the area of the three largest
// multiply them together
const res = Object.values(areaIdByVolume).sort((a, b) => b - a).slice(0, 3).reduce((prev, next) => prev * next);
console.log("part two", res);

// // iterate over the basin map
// // if this entry isn't null:
// // if this number has a higher number to the right or south,
// // map that higher number to this number
// const basinHierarchy = [];
// for (let y = 0; y < basinMap.length; y++) {
//   for (let x = 0; x < basinMap[0].length; x++) {
//     const cell = basinMap[y][x];
//     if (cell) {
//       if (
//         y !== basinMap.length - 1 &&
//         basinMap[y + 1][x] !== null &&
//         cell !== basinMap[y + 1][x]
//       ) {
//           const hasSet = basinHierarchy[basinMap[y + 1][x]];
//           if (hasSet && hasSet !== cell) {
//             console.log("TYPE ONE", cell, hasSet);
//             basinHierarchy[cell] = hasSet;
//           } else if (!hasSet) {
//             console.log("TYPE two", basinMap[y + 1][x], cell);
//             basinHierarchy[basinMap[y + 1][x]] = cell;
//           }
//       }
//       if (
//         x !== basinMap[y].length - 1 &&
//         basinMap[y][x + 1] !== null &&
//         cell !== basinMap[y][x + 1]
//       ) {
//           const hasSet = basinHierarchy[basinMap[y][x + 1]];
//           if (hasSet && hasSet !== cell) {
//             console.log("TYPE THREE", cell, hasSet);
//             basinHierarchy[cell] = hasSet;
//           } else if (!hasSet) {
//             console.log("TYPE FOUR", basinMap[y][x + 1], cell);
//             basinHierarchy[basinMap[y][x + 1]] = cell;
//           }
//       }
//     }
//   }
// }

// // probably a much easier way to do this
// // group the basinHierarchy together
// let goAgain = true;
// while (goAgain) {
//     goAgain = false;
//     basinHierarchy.forEach((entry, index) => {
//         const target = basinHierarchy[entry];
//         if (typeof target === "number" && entry !== target) {
//             goAgain = true;
//             basinHierarchy[index] = target;
//         }
//     })
// }

// count the number of each number
// const resMap = basinMap.flat();
// const areaIdByVolume = {};
// resMap.forEach(cell => {
//     if (typeof cell === 'number') {
//         let targetCell = cell;
//         if (basinHierarchy[cell]) {
//             targetCell = basinHierarchy[cell];
//         }
//         if (!areaIdByVolume[targetCell]) {
//           areaIdByVolume[targetCell] = 0;
//         }
//         areaIdByVolume[targetCell] += 1;
//     }
// })

// get the area of the three largest
// multiply them together
// const res = Object.values(areaIdByVolume).sort((a, b) => b - a).slice(0, 3).reduce((prev, next) => prev * next);
// console.log("part two", res);
