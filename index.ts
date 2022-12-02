const args = process.argv.slice(2);

const year = (args.length === 1) 
  ? new Date(Date.parse(args[0])).getFullYear 
  : new Date().getFullYear();

import(`${import.meta.dir}/${year}/index.ts`).then((solution) => {
  solution?.();
});
