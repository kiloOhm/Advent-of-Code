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
  const rope = new Rope(2);
  for(const line of lines) {
    const [direction, _steps] = line.split(' ');
    const steps = parseInt(_steps);
    rope.head.travel(direction, steps);
  }
  return rope.tail.visited.size;
}

async function part2(lines: string[]) {
  const rope = new Rope(10);
  for(const line of lines) {
    const [direction, _steps] = line.split(' ');
    const steps = parseInt(_steps);
    rope.head.travel(direction, steps);
  }
  console.log(rope.tail.visited);
  return rope.tail.visited.size;
}

//#region helpers

class Rope {
  knots: Knot[] = [];
  get head() {
    return this.knots[this.knots.length - 1];
  }
  get tail() {
    return this.knots[0];
  }
  constructor(length: number) {
    for(let i = 0; i < length; i++) {
      const knot = new Knot(i, 0, 0, this.knots[i - 1]);
      this.knots.push(knot);
    }
  }
}

class Knot {
  readonly index: number;
  x: number;
  y: number;
  follower?: Knot;
  visited = new Set<string>();
  constructor(index: number, x: number, y: number, follower?: Knot) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.follower = follower;
    this.visited.add(this.toString());
  }
  toString() {
    return `${this.x},${this.y}`;
  }
  travel(direction: string, steps: number) {
    for(let i = 0; i < steps; i++) {
      const { x, y } = move[direction](this, 1);
      this.x = x;
      this.y = y;
      this.visited.add(this.toString());
      if(this.follower) {
        //check if this is adjacent to follower
        if(Math.abs(this.x - this.follower.x) <= 1 
          && Math.abs(this.y - this.follower.y) <= 1) {
          //if so, do nothing
          continue;
        } else {
          //if not, move follower towards this
          let dir = '';
          if(this.x > this.follower.x) {
            dir += 'R';
          } else if(this.x < this.follower.x) {
            dir += 'L';
          }
          if(this.y > this.follower.y) {
            dir += 'U';
          } else if(this.y < this.follower.y) {
            dir += 'D';
          }
          this.follower.travel(dir, 1);
        }
      }
    }
  }
}

const move = {
  'R': (k: Knot, steps: number) => ({ x: k.x + steps, y: k.y }),
  'L': (k: Knot, steps: number) => ({ x: k.x - steps, y: k.y }),
  'U': (k: Knot, steps: number) => ({ x: k.x, y: k.y + steps }),
  'D': (k: Knot, steps: number) => ({ x: k.x, y: k.y - steps }),
  'LU': (k: Knot, steps: number) => ({ x: k.x - steps, y: k.y + steps }),
  'RU': (k: Knot, steps: number) => ({ x: k.x + steps, y: k.y + steps }),
  'LD': (k: Knot, steps: number) => ({ x: k.x - steps, y: k.y - steps }),
  'RD': (k: Knot, steps: number) => ({ x: k.x + steps, y: k.y - steps }),
};

//#endregion helpers
