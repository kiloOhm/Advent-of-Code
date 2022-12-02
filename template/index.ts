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
  for(const [i, line] of lines.entries()) {
    
  }
}

async function part2() {
  const lines = await getLines();
  for(const [i, line] of lines.entries()) {
    
  }
}