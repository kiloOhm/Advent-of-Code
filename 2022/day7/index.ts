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
  const tree = buildFSTree(lines);
  const flat = tree.flatten();
  let acc = 0;
  for(const node of flat) {
    if(node.isDir && node.size < 100000) {
      acc += node.size;
    }
  }
  return acc;
}

async function part2(lines: string[]) {
  const totalSpace = 70000000;
  const tree = buildFSTree(lines);
  const usedSpace = tree.root.size;
  const free = totalSpace - usedSpace;
  const goal = 30000000;
  const missing = goal - free;
  let smallest = Infinity;
  const flat = tree.flatten();
  for(const node of flat) {
    if(node.isDir 
      && node.size < smallest 
      && node.size >= missing) {
      smallest = node.size;
    }
  }
  return smallest;
}

//#region helpers

function parseLine(line: string) {
  const tokens = line.split(' ');
  switch(tokens[0]) {
    case '$':
      const action = tokens[1];
      const args = tokens.slice(2);
      return { 
        command: {
          action, 
          args,
        } 
      };
    case 'dir':
      return {
        dir: tokens[1],
      };
    default:
      return {
        file: {
          name: tokens[1],
          size: parseInt(tokens[0]),
        }
      };
  }
}

function buildFSTree(lines: string[]) {
  let currentNode: FSTreeNode;
  for(const line of lines) {
    const parsed = parseLine(line);
    if(parsed.command) {
      switch(parsed.command.action) {
        case 'cd': 
          if(parsed.command.args[0] === '..') {
            if(!currentNode.parent) {
              throw new Error('Cannot cd .. from root');
            }
            currentNode = currentNode.parent;
          } else {
            const dir = parsed.command.args[0];
            if(!currentNode) {
              currentNode = new FSTreeNode(dir);
            } else {
              const child = currentNode?.children.find(c => c.name === dir);
              if(!child) {
                currentNode.children.push(new FSTreeNode(dir));
              }
              child.parent = currentNode;
              currentNode = child;
            }
          }
        break;
        case 'ls':
          // do nothing
        break;
      }
    } else if(parsed.dir) {
      const child = currentNode?.children.find(c => c.name === parsed.dir);
      if(!child) {
        currentNode.children.push(new FSTreeNode(parsed.dir));
      }
    } else if(parsed.file) {
      const child = currentNode?.children.find(c => c.name === parsed.file.name);
      if(!child) {
        currentNode.children.push(new FSTreeNode(parsed.file.name, parsed.file.size));
      }
    }
  }
  return new FSTree(currentNode.root);
}

class FSTreeNode {
  parent?: FSTreeNode;
  children: FSTreeNode[] = [];
  name: string;
  _size?: number;
  get isDir() {
    return this._size === undefined;
  }
  get root() {
    return this.parent ? this.parent.root : this;
  }
  get size() {
    if(this.isDir) {
      return this.children.reduce((acc, child) => acc + child.size, 0);
    } else {
      return this._size;
    }
  }
  print(indent = '') {
    console.log(indent + `- ${this.name} (${(this.isDir ? 'dir' : 'file') + ', size=' + this.size})`);
    if(this.children?.length == 0) return;
    for(const child of this.children) {
      child.print(indent + '  ');
    }
  }
  flatten() {
    const result = [{ name: this.name, size: this.size, isDir: this.isDir}];
    if(this.children?.length == 0) return result;
    for(const child of this.children) {
      result.push(...child.flatten());
    }
    return result;
  }
  constructor(name: string, size?: number) {
    this.name = name;
    this._size = size;
  }
}

class FSTree {
  root: FSTreeNode;
  constructor(root: FSTreeNode) {
    this.root = root;
  }
  print() {
    this.root.print();
  }
  flatten() {
    return this.root.flatten();
  }
}

//#endregion helpers
