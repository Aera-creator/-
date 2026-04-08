import { MinHeap } from './structures.js';

export function topK(items, k, scoreFn) {
  const heap = new MinHeap((a, b) => a.score - b.score);
  for (const item of items) {
    const score = scoreFn(item);
    const node = { item, score };
    if (heap.size() < k) {
      heap.push(node);
      continue;
    }
    if (score > heap.peek().score) {
      heap.pop();
      heap.push(node);
    }
  }

  const result = [];
  while (heap.size()) {
    result.push(heap.pop());
  }
  return result.reverse();
}

export function dijkstra(graph, start, weightSelector) {
  const dist = new Map();
  const prev = new Map();
  const visited = new Set();
  const queue = new MinHeap((a, b) => a.cost - b.cost);

  for (const node of graph.nodes()) {
    dist.set(node, Infinity);
    prev.set(node, null);
  }
  dist.set(start, 0);
  queue.push({ node: start, cost: 0 });

  while (queue.size()) {
    const { node } = queue.pop();
    if (visited.has(node)) continue;
    visited.add(node);

    for (const edge of graph.neighbors(node)) {
      const w = weightSelector(edge);
      const alt = dist.get(node) + w;
      if (alt < dist.get(edge.to)) {
        dist.set(edge.to, alt);
        prev.set(edge.to, node);
        queue.push({ node: edge.to, cost: alt });
      }
    }
  }

  return { dist, prev };
}

export function buildPath(prev, target) {
  const path = [];
  let cur = target;
  while (cur !== null) {
    path.push(cur);
    cur = prev.get(cur);
  }
  return path.reverse();
}

export function greedyMultiTarget(graph, start, targets, weightSelector) {
  const remaining = new Set(targets);
  let current = start;
  let totalCost = 0;
  let route = [start];

  while (remaining.size) {
    const { dist, prev } = dijkstra(graph, current, weightSelector);
    let bestTarget = null;
    let bestCost = Infinity;

    for (const t of remaining) {
      const c = dist.get(t);
      if (c < bestCost) {
        bestCost = c;
        bestTarget = t;
      }
    }

    if (bestTarget === null || bestCost === Infinity) break;
    const path = buildPath(prev, bestTarget);
    route = route.concat(path.slice(1));
    totalCost += bestCost;
    current = bestTarget;
    remaining.delete(bestTarget);
  }

  if (current !== start) {
    const { dist, prev } = dijkstra(graph, current, weightSelector);
    const back = dist.get(start);
    if (Number.isFinite(back)) {
      route = route.concat(buildPath(prev, start).slice(1));
      totalCost += back;
    }
  }

  return { route, totalCost };
}

export function fuzzyScore(text, query) {
  const a = text.toLowerCase();
  const b = query.toLowerCase();
  if (!b) return 1;
  if (a.includes(b)) return 1.2;

  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const distance = dp[a.length][b.length];
  return Math.max(0, 1 - distance / Math.max(a.length, b.length, 1));
}

export function buildInvertedIndex(diaries) {
  const index = new Map();
  diaries.forEach((diary) => {
    const words = tokenize(`${diary.title} ${diary.body} ${diary.destination}`);
    words.forEach((w) => {
      if (!index.has(w)) index.set(w, new Set());
      index.get(w).add(diary.id);
    });
  });
  return index;
}

export function searchByIndex(query, diaries, index) {
  const words = tokenize(query);
  if (words.length === 0) return diaries;

  let candidate = null;
  for (const w of words) {
    const ids = index.get(w) || new Set();
    if (candidate === null) {
      candidate = new Set(ids);
    } else {
      candidate = new Set([...candidate].filter((id) => ids.has(id)));
    }
  }

  if (!candidate) return [];
  return diaries.filter((d) => candidate.has(d.id));
}

function tokenize(text) {
  const normalized = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(Boolean);
  const extra = [];

  for (const w of words) {
    if (/^[\u4e00-\u9fa5]+$/.test(w) && w.length > 1) {
      for (let i = 0; i < w.length; i += 1) extra.push(w[i]);
      for (let i = 0; i < w.length - 1; i += 1) extra.push(w.slice(i, i + 2));
    }
  }

  return words.concat(extra);
}

export function pseudoHuffmanCompress(text) {
  const freq = {};
  for (const ch of text) freq[ch] = (freq[ch] || 0) + 1;
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const dict = {};
  sorted.forEach(([ch], idx) => {
    dict[ch] = idx.toString(2).padStart(3, '0');
  });
  const binary = [...text].map((ch) => dict[ch]).join('');
  return { binary, dict, ratio: text.length ? (binary.length / (text.length * 8)).toFixed(2) : '1.00' };
}

export function kmeans2D(points, k = 3, iterations = 8) {
  if (!points.length) return [];
  const centers = points.slice(0, k).map((p) => [...p]);
  const groups = new Array(points.length).fill(0);

  for (let t = 0; t < iterations; t += 1) {
    for (let i = 0; i < points.length; i += 1) {
      let best = 0;
      let bestDist = Infinity;
      for (let c = 0; c < centers.length; c += 1) {
        const d = sqDist(points[i], centers[c]);
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
      groups[i] = best;
    }

    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    for (let i = 0; i < points.length; i += 1) {
      const g = groups[i];
      sums[g][0] += points[i][0];
      sums[g][1] += points[i][1];
      sums[g][2] += 1;
    }

    for (let c = 0; c < k; c += 1) {
      if (sums[c][2] === 0) continue;
      centers[c][0] = sums[c][0] / sums[c][2];
      centers[c][1] = sums[c][1] / sums[c][2];
    }
  }

  return groups;
}

function sqDist(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

export function routeDeviation(currentNode, plannedPath, tolerance = 2) {
  if (!plannedPath.length) return { deviated: false, nearestIndex: -1 };
  let nearestIndex = 0;
  for (let i = 0; i < plannedPath.length; i += 1) {
    if (plannedPath[i] === currentNode) {
      nearestIndex = i;
      break;
    }
  }
  const deviated = !plannedPath.includes(currentNode) || nearestIndex > tolerance;
  return { deviated, nearestIndex };
}
