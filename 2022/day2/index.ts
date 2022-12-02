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
  let score = 0;
  for(const [i, line] of lines.entries()) {
    const [opponent, me] = line.split(' ');
    score += getScore(getNumValue(opponent), getNumValue(me));
  }
  return score;
}

async function part2() {
  const lines = await getLines();
  let score = 0;
  for(const [i, line] of lines.entries()) {
    const [opponent, me] = line.split(' ');
    const outcomes: ('loss' | 'draw' | 'win' )[] = ['loss', 'draw', 'win'];
    const answer = getAnswer(getNumValue(opponent), outcomes[getNumValue(me) - 1]);
    score += getScore(getNumValue(opponent), answer);
  }
  return score;
}

// #region helpers
/**
 * A > B > C
 * X > Y > Z
 * 1 > 3 > 2
 * r > s > p
 * 1 2 = win
 * 3 1 = win
 * 2 3 = win
 * 2 1 = loss
 * 1 3 = loss
 * 3 2 = loss
 */

function getNumValue(input: string) {
  const iNum = input.charCodeAt(0);
  const aNum = 65;
  const xNum = 88;
  return Math.min(Math.abs(iNum - aNum), Math.abs(iNum - xNum)) + 1;
}

function getScore(opponent: number, me: number) {
  if(opponent === me) {
    return 3 + me;
  }
  for(let i = 1; i <= 3; i++) {
    if(opponent === i && (me === i + 1 || me === i - 2)) {
      return 6 + me;
      // 1 2, 2 3, 3 1
    }
    if(opponent === i && (me === i - 1 || me === i + 2)) {
      return me;
      // 2 1, 1 3, 3 2
    }
  }
}

function getAnswer(opponent: number, outcome: 'win' | 'loss' | 'draw') {
  switch(outcome) {
    case 'win':
      return opponent < 3 ? opponent + 1 : 1;
      // 1 2, 2 3, 3 1
    case 'loss':
      return opponent > 1 ? opponent - 1 : 3;
      // 2 1, 1 3, 3 2
    case 'draw':
      return opponent;
  }
}

// #endregion helpers
