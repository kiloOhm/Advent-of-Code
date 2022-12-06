import { readFile } from 'fs/promises';
import { clone, uniq } from 'lodash';

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
  const markerBuffer = new Queue(4);
  for(const line of lines) {
    for(const [i, char] of line.split('').entries()) {
      markerBuffer.enqueue(char);
      if(i < 3) continue;
      if(uniq(markerBuffer.items).length === 4) {
        return i + 1;
      }
    }
  }
  return 0;
}

async function part2(lines: string[]) {
  const markerBuffer = new Queue(14);
  let packetStart = false;
  for(const line of lines) {
    for(const [i, char] of line.split('').entries()) {
      markerBuffer.enqueue(char);
      if(packetStart) {
        if(i < 13) continue;
        if(uniq(markerBuffer.items).length === 14) {
          return i + 1;
        }
      } else {
        if(i < 3) continue;
        if(uniq(markerBuffer.items.slice(-4)).length === 4) {
          packetStart = true;
        }
      }
    }
  }
  return 0;
}

//#region helpers

class Queue<T> {
  private _queue: T[] = [];
  private _maxLength?: number;
  get length() {
    return this._queue.length;
  }
  get items() {
    return clone(this._queue);
  }
  constructor(maxLength?: number) {
    this._maxLength = maxLength;
  }
  enqueue(item: T) {
    this._queue.push(item);
    if(this._maxLength && this.length > this._maxLength) {
      return this.dequeue();
    }
  }
  dequeue() {
    return this._queue.shift();
  }
}

//#endregion helpers
