import { readFile } from 'fs/promises';

let example = false;

export default async function() {
  const lines = (await readFile(import.meta.dir + ( example ? '/example.txt' : '/input.txt'), {
    encoding: 'utf-8',
  })).split('\n');
  return await Promise.all([
    part1(lines),
    part2(lines),
  ]);
}

async function part1(lines: string[]) {
  const numArray = convertToNumArray(lines);
  const visible = new Set<string>();
  const rows = numArray.length;
  const columns = numArray[0].length;
  //from left and top
  let highestInColumn = new Array(columns).fill(0);
  for(let r = 0; r < rows; r++) {
    let highestInRow = 0;
    for(let c = 0; c < columns; c++) {
      let v = false;
      //edges
      if(r === 0 || c === 0 || r === rows - 1 || c === columns - 1) {
        v = true;
      }
      //left
      if(numArray[r][c] > highestInRow) {
        highestInRow = numArray[r][c];
        v = true;
      }
      //top
      if(numArray[r][c] > highestInColumn[c]) {
        highestInColumn[c] = numArray[r][c];
        v = true;
      }
      if(v) {
        visible.add(`${c},${r}`);
      }
    }
  }
  //from right and bottom
  highestInColumn = new Array(columns).fill(0);
  for(let r = rows - 1; r >= 0; r--) {
    let highestInRow = 0;
    for(let c = columns - 1; c >= 0; c--) {
      let v = false;
      //right
      if(numArray[r][c] > highestInRow) {
        highestInRow = numArray[r][c];
        v = true;
      }
      //bottom
      if(numArray[r][c] > highestInColumn[c]) {
        highestInColumn[c] = numArray[r][c];
        v = true;
      }
      if(v) {
        visible.add(`${c},${r}`);
      }
    }
  }
  return visible.size;
}

async function part2(lines: string[]) {
  const numArray = convertToNumArray(lines);
  const rows = numArray.length;
  const columns = numArray[0].length;
  const scores = new Map<string, number>();
  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < columns; c++) {
      const tree = new Tree(c, r, numArray[r][c]);
      // if(visible.has(tree.posString())) continue;
      const vd = visibleDistances(tree, numArray);
      const score = vd.bottom * vd.left * vd.right * vd.top;
      // console.log(tree.posString(), vd, score);
      scores.set(tree.posString(), score);
    }
  }
  return Math.max(...scores.values());
}

//#region helpers

class Tree {
  c: number;
  r: number;
  h: number;
  constructor(c: number, r: number, h: number) {
    this.c = c;
    this.r = r;
    this.h = h;
  }
  posString() {
    return `${this.c},${this.r}`;
  }
}

function convertToNumArray(lines: string[]) {
  return lines.map(line => line.split('').map(Number));
}

function visibleDistances(tree: Tree, grid: number[][]) {
  //left
  let left: number;
  for(let c = tree.c - 1; c >= 0; c--) {
    if(grid[tree.r][c] >= tree.h) {
      left = tree.c - c;
      break;
    }
  }
  if(left === undefined) left = tree.c;
  //top
  let top: number;
  for(let r = tree.r - 1; r >= 0; r--) {
    if(grid[r][tree.c] >= tree.h) {
      top = tree.r - r;
      break;
    }
  }
  if(top === undefined) top = tree.r;
  //right
  let right: number;
  for(let c = tree.c + 1; c < grid[0].length; c++) {
    if(grid[tree.r][c] >= tree.h) {
      right = c - tree.c;
      break;
    }
  }
  if(right === undefined) right = grid[0].length - tree.c - 1;
  //bottom
  let bottom: number;
  for(let r = tree.r + 1; r < grid.length; r++) {
    if(grid[r][tree.c] >= tree.h) {
      bottom = r - tree.r;
      break;
    }
  }
  if(bottom === undefined) bottom = grid.length - tree.r - 1;
  return {
    left,
    top,
    right,
    bottom
  };
}

//#endregion helpers
