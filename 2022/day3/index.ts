import { readFile } from 'fs/promises';
import { intersection } from 'lodash';

export default async function() {
  const lines = (await readFile(import.meta.dir + '/input.txt', {
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
    const [left, right] = getRucksackHalves(line);
    const common = intersection(left.split(''), right.split(''));
    total += common.reduce((acc, char) => acc + getItemValue(char), 0);
  }
  return total;
}

async function part2(lines: string[]) {
  let total = 0;
  let group: string[] = [];
  for(const [i, line] of lines.entries()) {
    group.push(line);
    if((i + 1) % 3 === 0) {
      const common = intersection(...group.map((g) => g.split('')));
      total += common?.reduce((acc, char) => acc + getItemValue(char), 0);
      group = [];
    }
  }
  return total;
}

//#region helpers

function getRucksackHalves(input: string) {
  const mid = Math.trunc(input.length / 2);
  return [
    input.slice(0, mid),
    input.slice(mid),
  ];
}

function getItemValue(char: string) {
  const charNum = char.charCodeAt(0);
  const a = 97;
  const A = 65;
  return (charNum < a ? charNum - A + 26 : charNum - a) + 1;
}

//#endregion helpers
