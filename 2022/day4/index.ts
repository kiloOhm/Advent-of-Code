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
  let total = 0;
  for(const [i, line] of lines.entries()) {
    const [range1, range2] = getRanges(line);
    if(range1[0] >= range2[0] && range1[1] <= range2[1]) {
      total++;
    } else if(range2[0] >= range1[0] && range2[1] <= range1[1]) {
      total++;
    }
  }
  return total;
}

async function part2(lines: string[]) {
  let total = 0;
  for(const [i, line] of lines.entries()) {
    const [range1, range2] = getRanges(line);
    if(range2[0] >= range1[0] && range2[0] <= range1[1]) {
      total++;
    } else if(range1[0] >= range2[0] && range1[0] <= range2[1]) {
      total++;
    }
  }
  return total;
}

//#region helpers

function getRanges(input: string) {
  return input.split(',').map(range => range.split('-').map(Number));
}

//#endregion helpers
