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
  //clone lines because shift() mutates it
  lines = new Array(...lines);
  let total = 0;
  let x = 1;
  let add: number;
  let cycle = 1;
  while(true) {
    //signal strength
    if((cycle + 20) % 40 === 0) {
      const signalStrength = x  * cycle;
      total += signalStrength;
    }
    //addx operation
    if(add) {
      x += add;
      add = undefined;
      cycle++;
      continue;
    }
    const instruction = lines.shift();
    if(!instruction) {
      break;
    }
    const tokens = instruction.split(' ');
    switch(tokens[0]) {
      case 'noop':
        break;
      case 'addx':
        add = Number(tokens[1]);
        break;
    }
    cycle++;
  }
  return total;
}

async function part2(lines: string[]) {
  let crt = '';
  let x = 1;
  let add: number;
  let cycle = 0;
  while(true) {
    if(lines.length === 0) break;
    const drawingPixel = (cycle % 40);
    if(Math.abs(x - drawingPixel) <= 1) {
      crt += '#';
    } else {
      crt += '.';
    }
    if(drawingPixel === 39) {
      crt += '\n';
    }
    //addx operation
    if(add) {
      x += add;
      add = undefined;
      cycle++;
      continue;
    }
    const instruction = lines.shift();
    const tokens = instruction.split(' ');
    switch(tokens[0]) {
      case 'noop':
        break;
      case 'addx':
        add = Number(tokens[1]);
        break;
    }
    cycle++;
  }
  return crt.split('\n').filter(x => x);
}
