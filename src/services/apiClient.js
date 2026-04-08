import {
  buildProfile as buildProfileLocal,
  compressDiary as compressDiaryLocal,
  concertPlan as concertPlanLocal,
  getDiaryDetail as getDiaryDetailLocal,
  getFoodDetail as getFoodDetailLocal,
  getPOIDetail as getPOIDetailLocal,
  getSystemMeta as getSystemMetaLocal,
  getTeamRoom as getTeamRoomLocal,
  planMultiRoute as planMultiRouteLocal,
  planSingleRoute as planSingleRouteLocal,
  queryFacilities as queryFacilitiesLocal,
  recommendFood as recommendFoodLocal,
  recommendPOI as recommendPOILocal,
  searchDiaries as searchDiariesLocal,
  teamCollab as teamCollabLocal
} from './systemService.js';

let resolvedBase = '';

export function getApiBaseCandidates() {
  const candidates = [];
  if (typeof window !== 'undefined') {
    if (window.location.protocol.startsWith('http')) {
      candidates.push(`${window.location.origin}/api`);
    }
    candidates.push('http://127.0.0.1:3000/api');
  }
  return [...new Set(candidates)];
}

async function requestJson(path, options = {}) {
  const { fallback, method = 'GET', body } = options;
  const candidates = resolvedBase ? [resolvedBase] : getApiBaseCandidates();

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
      const payload = await response.json();
      resolvedBase = base;
      return payload;
    } catch (error) {
      // Try the next base.
    }
  }

  if (fallback) return fallback();
  throw new Error(`API unavailable for ${path}`);
}

export function getSystemMeta() {
  return requestJson('/meta', { fallback: () => getSystemMetaLocal() });
}

export function recommendPOI(params) {
  const search = new URLSearchParams({
    query: params.query || '',
    category: params.category || '',
    interests: params.interests || '',
    k: String(params.k || 10)
  });
  return requestJson(`/recommendations?${search.toString()}`, { fallback: () => recommendPOILocal(params) });
}

export function planSingleRoute(params) {
  const search = new URLSearchParams({
    start: params.start || '',
    target: params.target || '',
    strategy: params.strategy || 'distance',
    transport: params.transport || 'walk'
  });
  return requestJson(`/routes/single?${search.toString()}`, { fallback: () => planSingleRouteLocal(params) });
}

export function planMultiRoute(params) {
  const search = new URLSearchParams({
    start: params.start || '',
    targets: params.targets || '',
    strategy: params.strategy || 'distance'
  });
  return requestJson(`/routes/multi?${search.toString()}`, { fallback: () => planMultiRouteLocal(params) });
}

export function queryFacilities(params) {
  const search = new URLSearchParams({
    origin: params.origin || '',
    category: params.category || ''
  });
  return requestJson(`/facilities?${search.toString()}`, { fallback: () => queryFacilitiesLocal(params) });
}

export function searchDiaries(params) {
  const search = new URLSearchParams({
    keyword: params.keyword || '',
    sortBy: params.sortBy || 'heat'
  });
  return requestJson(`/diaries?${search.toString()}`, { fallback: () => searchDiariesLocal(params) });
}

export function compressDiary(text) {
  return requestJson('/diary-draft', {
    method: 'POST',
    body: { text },
    fallback: () => compressDiaryLocal(text)
  });
}

export function recommendFood(params) {
  const search = new URLSearchParams({
    query: params.query || '',
    cuisine: params.cuisine || '',
    near: params.near || '',
    k: String(params.k || 10)
  });
  return requestJson(`/foods?${search.toString()}`, { fallback: () => recommendFoodLocal(params) });
}

export function concertPlan(params) {
  const search = new URLSearchParams({
    venue: params.venue || '虹馆Live',
    timeLimitMin: String(params.timeLimitMin || 40)
  });
  return requestJson(`/concert-plan?${search.toString()}`, { fallback: () => concertPlanLocal(params) });
}

export function buildProfile() {
  return requestJson('/profile', { fallback: () => buildProfileLocal() });
}

export function teamCollab(params) {
  return Promise.resolve(teamCollabLocal(params));
}

export function getPOIDetail(id) {
  return requestJson(`/pois/${encodeURIComponent(id)}`, { fallback: () => getPOIDetailLocal(id) });
}

export function getDiaryDetail(id) {
  return requestJson(`/diaries/${encodeURIComponent(id)}`, { fallback: () => getDiaryDetailLocal(id) });
}

export function getFoodDetail(id) {
  return requestJson(`/foods/${encodeURIComponent(id)}`, { fallback: () => getFoodDetailLocal(id) });
}

export function getTeamRoom(currentNode) {
  const search = new URLSearchParams({ currentNode: currentNode || '虹馆Live' });
  return requestJson(`/team-room?${search.toString()}`, { fallback: () => getTeamRoomLocal(currentNode) });
}
