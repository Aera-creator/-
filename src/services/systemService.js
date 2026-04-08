import {
  buildInvertedIndex,
  buildPath,
  dijkstra,
  fuzzyScore,
  greedyMultiTarget,
  kmeans2D,
  pseudoHuffmanCompress,
  routeDeviation,
  searchByIndex,
  topK
} from '../core/algorithms.js';
import { Graph } from '../core/structures.js';
import { concerts, diaries, foods, graphEdges, pois, teamState, users } from '../data/sampleData.js';

const graph = new Graph();
graphEdges.forEach(([from, to, payload]) => graph.addEdge(from, to, payload));
const diaryIndex = buildInvertedIndex(diaries);

function poiScoreFactory({ heatWeight, ratingWeight, interestKeywords }) {
  return (poi) => {
    const matchCount = poi.tags.filter((t) => interestKeywords.some((k) => t.includes(k))).length;
    const interestScore = matchCount * 15;
    return poi.heat * heatWeight + poi.rating * 20 * ratingWeight + interestScore;
  };
}

export function recommendPOI({ query, category, interests, k = 5 }) {
  const interestKeywords = interests.split(/[，,\s]+/).filter(Boolean);
  const filtered = pois.filter((p) => {
    const byCategory = !category || p.category === category;
    const byQuery =
      !query || p.name.includes(query) || p.tags.some((tag) => tag.includes(query)) || p.area.includes(query);
    return byCategory && byQuery;
  });

  const scored = topK(filtered, k, poiScoreFactory({ heatWeight: 0.55, ratingWeight: 0.45, interestKeywords }));
  return scored.map((r) => ({ ...r.item, score: r.score.toFixed(1) }));
}

export function getPOIDetail(idOrName) {
  const poi = pois.find((item) => item.id === idOrName || item.name === idOrName);
  if (!poi) return null;

  const relatedDiaries = diaries
    .filter((item) => item.destination.includes(poi.name) || item.destination.includes(poi.area) || item.body.includes(poi.name))
    .slice(0, 4);

  const nearbyFoods = foods
    .filter((item) => item.near.includes(poi.name) || item.near.includes(poi.area))
    .slice(0, 4);

  const nearbyServices = graph.nodes().includes(poi.name) ? queryFacilities({ origin: poi.name, category: '' }).slice(0, 4) : [];

  return {
    poi,
    relatedDiaries,
    nearbyFoods,
    nearbyServices
  };
}

function resolveWeight(strategy, transport = 'walk', crowdFactor = 1.0) {
  return (edge) => {
    if (transport === 'walk' && edge.walkOnly === false && strategy === 'indoor') {
      return edge.time * 1.4;
    }
    if (strategy === 'distance') return edge.distance;
    if (strategy === 'time') return edge.time;
    if (strategy === 'crowd') return edge.time * edge.crowd * crowdFactor;
    return edge.time;
  };
}

export function planSingleRoute({ start, target, strategy, transport }) {
  const weightSelector = resolveWeight(strategy, transport);
  const { dist, prev } = dijkstra(graph, start, weightSelector);
  const total = dist.get(target);
  if (!Number.isFinite(total)) {
    return { error: '未找到可达路径，请检查起点和终点是否连通。' };
  }
  return {
    path: buildPath(prev, target),
    total: total.toFixed(2),
    strategy
  };
}

export function planMultiRoute({ start, targets, strategy }) {
  const cleanTargets = targets.split(/[，,\s]+/).filter(Boolean);
  const result = greedyMultiTarget(graph, start, cleanTargets, resolveWeight(strategy));
  return { path: result.route, total: result.totalCost.toFixed(2), visited: cleanTargets.length };
}

export function queryFacilities({ origin, category }) {
  const facilities = pois.filter(
    (p) =>
      p.category === '服务设施' &&
      (!category || p.name.includes(category) || p.tags.some((tag) => tag.includes(category)))
  );
  const { dist } = dijkstra(graph, origin, (edge) => edge.distance);
  return facilities
    .map((f) => ({ ...f, routeDistance: dist.get(f.name) }))
    .filter((f) => Number.isFinite(f.routeDistance))
    .sort((a, b) => a.routeDistance - b.routeDistance)
    .map((f) => ({ ...f, routeDistance: `${f.routeDistance.toFixed(2)} km` }));
}

export function searchDiaries({ keyword, sortBy = 'heat' }) {
  return searchByIndex(keyword, diaries, diaryIndex)
    .slice()
    .sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : b.heat - a.heat));
}

export function getDiaryDetail(id) {
  const diary = diaries.find((item) => item.id === id);
  if (!diary) return null;

  const relatedFoods = foods.filter((item) => diary.body.includes(item.name) || diary.destination.includes(item.near)).slice(0, 4);
  const relatedPois = pois.filter((item) => diary.body.includes(item.name) || diary.destination.includes(item.area)).slice(0, 4);

  return {
    diary,
    relatedFoods,
    relatedPois
  };
}

export function compressDiary(text) {
  return pseudoHuffmanCompress(text);
}

export function recommendFood({ query, cuisine, near, k = 5 }) {
  const candidates = foods.filter((f) => {
    const byCuisine = !cuisine || f.cuisine.includes(cuisine);
    const byNear = !near || f.near.includes(near);
    return byCuisine && byNear;
  });

  const ranked = topK(candidates, k, (item) => {
    const text = `${item.name} ${item.cuisine} ${item.shop}`;
    const fuzzy = query ? fuzzyScore(text, query) * 50 : 35;
    return item.heat * 0.6 + item.rating * 20 * 0.4 + fuzzy;
  });

  return ranked.map((r) => ({ ...r.item, score: r.score.toFixed(1) }));
}

export function getFoodDetail(idOrName) {
  const food = foods.find((item) => item.id === idOrName || item.name === idOrName);
  if (!food) return null;

  const nearbyPois = pois.filter((item) => item.name.includes(food.near) || item.area.includes(food.near) || food.near.includes(item.area)).slice(0, 4);
  const relatedDiaries = diaries.filter((item) => item.body.includes(food.name) || item.destination.includes(food.near)).slice(0, 4);

  return {
    food,
    nearbyPois,
    relatedDiaries
  };
}

export function concertPlan({ venue, timeLimitMin }) {
  const concert = concerts.find((c) => c.venue === venue);
  if (!concert) return { error: '未找到场馆数据。' };

  const checkinRanking = recommendPOI({ query: '', category: '打卡点', interests: '拍照 社交', k: 3 }).filter((p) =>
    concert.checkins.includes(p.name)
  );

  const foodRanking = recommendFood({ query: '夜宵', cuisine: '', near: '上海外滩', k: 3 }).filter((f) =>
    concert.foodCandidates.includes(f.name)
  );

  const route = planSingleRoute({ start: '上海外滩', target: venue, strategy: 'crowd', transport: 'metro' });
  const adviseDepartureMin = Math.max(0, Number(route.total || 0) + Number(timeLimitMin || 40));

  return {
    concert,
    checkinRanking,
    foodRanking,
    route,
    adviseDepartureMin: adviseDepartureMin.toFixed(0)
  };
}

export function buildProfile() {
  const vectors = users.map((u) => u.behaviorVector);
  const groups = kmeans2D(vectors, 3);
  return users.map((u, idx) => ({
    ...u,
    cluster: groups[idx],
    nextLevelExp: (u.level + 1) * 200,
    annualMemory: `${u.name}在本年完成${Math.round(u.exp / 20)}次有效互动，偏好${u.interests.join('、')}`
  }));
}

export function teamCollab({ currentNode }) {
  const deviation = routeDeviation(currentNode, teamState.plannedPath, 2);
  const voted = teamState.vote.A >= teamState.vote.B ? '方案A（外滩-场馆-打卡-夜宵）' : '方案B';
  return {
    ...teamState,
    currentNode,
    voted,
    deviation,
    alert: deviation.deviated ? '成员偏离路线，建议执行一键重规划。' : '队伍路线正常。'
  };
}

export function getTeamRoom(currentNode = teamState.plannedPath[1]) {
  const collab = teamCollab({ currentNode });
  return {
    ...collab,
    roomName: '城市出行小队',
    nextStops: collab.plannedPath.slice(1),
    activeMembers: teamState.members.slice(0, 2),
    pendingMembers: teamState.members.slice(2)
  };
}

export function getSystemMeta() {
  return {
    poiCount: pois.length,
    diaryCount: diaries.length,
    foodCount: foods.length,
    graphNodeCount: graph.nodes().length,
    moduleCount: 9,
    dataMode: 'mock'
  };
}
