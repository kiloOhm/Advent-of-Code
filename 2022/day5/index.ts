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
  const crates = [];
  for(const [i, line] of lines.entries()) {
    if(line === '') {
      lines = lines.slice(i + 1);
      break;
    }
    crates.push(line);
  }
  const parsed = parseCrates(crates);
  const stacks = convertToStacks(parsed);
  for(const [i, line] of lines.entries()) {
    const move = parseMove(line);
    if(move) {
      for(let i = 0; i < move.amount; i++) {
        stacks[move.to - 1].push(stacks[move.from - 1].pop());
      }
    }
  }
  return stacks.map(s => s[s.length - 1]).join('');
}

async function part2(lines: string[]) {
  const crates = [];
  for(const [i, line] of lines.entries()) {
    if(line === '') {
      lines = lines.slice(i + 1);
      break;
    }
    crates.push(line);
  }
  const parsed = parseCrates(crates);
  const stacks = convertToStacks(parsed);
  for(const [i, line] of lines.entries()) {
    const move = parseMove(line);
    if(move) {
      stacks[move.to - 1].push(...stacks[move.from - 1].splice(-move.amount));
    }
  }
  return stacks.map(s => s[s.length - 1]).join('');
}

//#region helpers

interface Crate {
  x: number, 
  y: number, 
  char: string
}

function parseCrates(lines: string[]) {
  const crates: Crate[] = [];
  for(const [i, line] of lines.entries()) {
    let x = 0;
    for(let j = 1; j < line.length; j += 4) {
      const char = line.charAt(j);
      if(char.match(/[A-Z]/)) {
        crates.push({
          x,
          y: i,
          char,
        })
      }
      x++;
    }
  }
  return crates;
}

function convertToStacks(crates: Crate[]) {
  const stacks: Crate[][] = [];
  for(const crate of crates) {
    if(!stacks[crate.x]) {
      stacks[crate.x] = [];
    }
    stacks[crate.x].push(crate);
  }
  return stacks.map(s => s.sort((a, b) => b.y - a.y)).map(s => s.map(c => c.char));
}

function parseMove(line: string) {
  const matches = line.match(/move (\d+) from (\d+) to (\d+)/);
  if(matches) {
    return {
      amount: parseInt(matches[1]),
      from: parseInt(matches[2]),
      to: parseInt(matches[3]),
    }
  }
}

//#endregion helpers
