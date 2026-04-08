export class MinHeap {
  constructor(compareFn = (a, b) => a - b) {
    this.data = [];
    this.compare = compareFn;
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    this.#bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this.#bubbleDown(0);
    }
    return top;
  }

  #bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[index], this.data[parent]) >= 0) break;
      [this.data[index], this.data[parent]] = [this.data[parent], this.data[index]];
      index = parent;
    }
  }

  #bubbleDown(index) {
    const length = this.data.length;
    while (true) {
      let smallest = index;
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      if (left < length && this.compare(this.data[left], this.data[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.data[right], this.data[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.data[index], this.data[smallest]] = [this.data[smallest], this.data[index]];
      index = smallest;
    }
  }
}

export class Graph {
  constructor() {
    this.adj = new Map();
  }

  addNode(node) {
    if (!this.adj.has(node)) this.adj.set(node, []);
  }

  addEdge(from, to, payload) {
    this.addNode(from);
    this.addNode(to);
    this.adj.get(from).push({ to, ...payload });
    this.adj.get(to).push({ to: from, ...payload });
  }

  neighbors(node) {
    return this.adj.get(node) || [];
  }

  nodes() {
    return Array.from(this.adj.keys());
  }
}
