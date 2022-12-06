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
  let bestElf = 0;
  let currentElf = 0;
  for(const line of lines) {
    if(!line) {
      if(currentElf > bestElf) {
        bestElf = currentElf;
      }
      currentElf = 0;
      continue;
    }
    currentElf += parseInt(line);
  }
  return bestElf;
}

async function part2(lines: string[]) {
  let bestElves: number[] = [];
  let currentElf = 0;
  for(const line of lines) {
    if(!line) {
      if(bestElves.length < 3) {
        bestElves.push(currentElf);
      } else {
        bestElves.sort((a, b) => a - b);
        if(currentElf > bestElves[0]) {
          bestElves[0] = currentElf;
        }
      }
      currentElf = 0;
      continue;
    }
    currentElf += parseInt(line);
  }
  const total = bestElves.reduce((a, b) => a + b, 0);
  return total;
}