const SnailNumberNode = class {
  leftNeighbor = null;
  rightNeighbor = null;

  constructor(value, depth, parent) {
    this.value = value;
    this.depth = depth;
    this.parent = parent;
  }

  explode() {
    return false;
  }

  toArray() {
    return this.value;
  }

  numberNodeIsChild(node) {
    return node === this;
  }

  getValueForMagnitude() {
    return this.value;
  }
};

const SnailPair = class {
  constructor(snailNumberArray, depth = 1, parent) {
    if (!snailNumberArray) {
      return;
    }
    if (typeof snailNumberArray === "string") {
      snailNumberArray = JSON.parse(snailNumberArray);
    }

    let left = snailNumberArray[0];
    let right = snailNumberArray[1];

    if (typeof left === "object") {
      // TODO combining existing snailpairs
      left = new SnailPair(left, depth + 1, this);
    } else {
      left = new SnailNumberNode(left, depth, this);
    }
    if (typeof right === "object") {
      right = new SnailPair(right, depth + 1, this);
    } else {
      right = new SnailNumberNode(right, depth, this);
    }

    this.left = left;
    this.right = right;
    this.depth = depth;
    this.parent = parent || null;

    if (!parent) {
      this.connectNodes();

      while (true) {
        if (this.explode() || this.split()) {
          this.connectNodes();
          continue;
        }
        break;
      }
    }
  }

  toArray() {
    return [this.left.toArray(), this.right.toArray()];
  }

  connectNodes() {
    const nodes = [];
    this.enumerateNumberNodes(nodes);
    this.connectNumberNodes(nodes);
  }

  enumerateNumberNodes(nodes) {
    if (this.left instanceof SnailNumberNode) {
      nodes.push(this.left);
    } else {
      this.left.enumerateNumberNodes(nodes);
    }
    if (this.right instanceof SnailNumberNode) {
      nodes.push(this.right);
    } else {
      this.right.enumerateNumberNodes(nodes);
    }
  }

  connectNumberNodes(nodes) {
    const rightBoundary = nodes.length - 1;
    nodes.forEach((node, index) => {
      if (index) {
        node.leftNeighbor = nodes[index - 1];
      } else {
        node.leftNeighbor = null;
      }
      if (index < rightBoundary) {
        node.rightNeighbor = nodes[index + 1];
      } else {
        node.rightNeighbor = null;
      }
    });
  }

  explode() {
    const depth = this.depth;
    const left = this.left;
    const right = this.right;

    if (
      depth > 4 &&
      left instanceof SnailNumberNode &&
      right instanceof SnailNumberNode
    ) {
      // do the thing
      if (left.leftNeighbor) {
        left.leftNeighbor.value += left.value;
      }
      if (right.rightNeighbor) {
        right.rightNeighbor.value += right.value;
      }

      const parent = this.parent;
      const target = parent.left === this ? "left" : "right";
      parent[target] = new SnailNumberNode(0, depth - 1, parent);

      return true;
    } else {
      return left.explode() || right.explode();
    }
  }

  split() {
    const nodes = [];
    this.enumerateNumberNodes(nodes);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const value = node.value;
      if (value >= 10) {
        const parent = node.parent;
        const target = parent.left === node ? "left" : "right";

        const newDepth = node.depth + 1;
        const snailPair = new SnailPair();
        snailPair.depth = newDepth;
        snailPair.parent = parent;
        snailPair.left = new SnailNumberNode(
          Math.floor(value / 2),
          newDepth,
          snailPair
        );
        snailPair.right = new SnailNumberNode(
          Math.ceil(value / 2),
          newDepth,
          snailPair
        );

        parent[target] = snailPair;

        return true;
      }
    }
    return false;
  }

  numberNodeIsChild(node) {
    return (
      this.left.numberNodeIsChild(node) || this.right.numberNodeIsChild(node)
    );
  }

  getValueForMagnitude() {
    return (
      3 * this.left.getValueForMagnitude() +
      2 * this.right.getValueForMagnitude()
    );
  }
};

const combineTwoSnailPairs = (originalLeft, originalRight) => {
  let left = originalLeft;
  let right = originalRight;

  if (left instanceof SnailPair) {
    left = JSON.stringify(left.toArray());
  }
  if (typeof left === "object") {
    left = JSON.stringify(left);
  }

  if (right instanceof SnailPair) {
    right = JSON.stringify(right.toArray());
  }
  if (typeof right === "object") {
    right = JSON.stringify(right);
  }

  return new SnailPair(`[${left},${right}]`);
};

const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "../input/18/input.txt"))
  .toString()
  .split("\n");

let result = new SnailPair(input.slice(0, 1)[0]);
input.slice(1).forEach((line, index) => {
  result = combineTwoSnailPairs(result, line);
});

console.log("part one:", result.getValueForMagnitude());

let highest = 0;
input.forEach((testOne) => {
  input.forEach((testTwo) => {
    if (testOne !== testTwo) {
      const test = combineTwoSnailPairs(
        testOne,
        testTwo
      ).getValueForMagnitude();
      if (test > highest) {
        highest = test;
      }
    }
  });
});

console.log("part two:", highest);
