import { readFile } from 'fs/promises';

export default async function() {
  return await Promise.all([
    part1(),
    part2(),
  ]);
}

async function getLines() {
  return (await readFile(import.meta.dir + '/input.txt', {
    encoding: 'utf-8',
  })).split('\n');
}

async function part1() {
  const lines = await getLines();
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

async function part2() {
  const lines = await getLines();
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