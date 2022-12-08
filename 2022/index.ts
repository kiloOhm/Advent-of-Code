import { readdir } from "fs/promises"
const year = 2022;
const dirs = await readdir(import.meta.dir, { withFileTypes: true });
const days = dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name)
  .sort((a, b) => a.slice(-1).charCodeAt(0) - b.slice(-1).charCodeAt(0));
const solutions = await Promise.all(days.map((day) => import(`${import.meta.dir}/${day}/index.ts`)));

try {
  // this is just to make the output look nice. No functional purpose.
  const answers = Object.fromEntries((await Promise.all([
    ...(solutions.map((solution) => solution?.default()) as Promise<any>[]),
  ])).map((answer, index) => ([`day${index + 1}`, Object.fromEntries(answer.map((part, index) => ([`part${index + 1}`, part])))])))
  console.log(JSON.stringify({ [year]: answers }, null, 2))
} catch (error) {
  console.error(error);
}
