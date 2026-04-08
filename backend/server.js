import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildProfile,
  compressDiary,
  concertPlan,
  getDiaryDetail,
  getFoodDetail,
  getPOIDetail,
  getSystemMeta,
  getTeamRoom,
  planMultiRoute,
  planSingleRoute,
  queryFacilities,
  recommendFood,
  recommendPOI,
  searchDiaries
} from '../src/services/systemService.js';

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (pathname === '/api/health') return json(res, 200, { ok: true, service: 'travel-system-api' });
    if (pathname === '/api/meta') return json(res, 200, getSystemMeta());

    if (pathname === '/api/recommendations') {
      return json(
        res,
        200,
        recommendPOI({
          query: url.searchParams.get('query') || '',
          category: url.searchParams.get('category') || '',
          interests: url.searchParams.get('interests') || '夜景 演唱会 美食',
          k: Number(url.searchParams.get('k') || 10)
        })
      );
    }

    if (pathname === '/api/routes/single') {
      return json(
        res,
        200,
        planSingleRoute({
          start: url.searchParams.get('start') || '',
          target: url.searchParams.get('target') || '',
          strategy: url.searchParams.get('strategy') || 'distance',
          transport: url.searchParams.get('transport') || 'walk'
        })
      );
    }

    if (pathname === '/api/routes/multi') {
      return json(
        res,
        200,
        planMultiRoute({
          start: url.searchParams.get('start') || '',
          targets: url.searchParams.get('targets') || '',
          strategy: url.searchParams.get('strategy') || 'distance'
        })
      );
    }

    if (pathname === '/api/facilities') {
      return json(
        res,
        200,
        queryFacilities({
          origin: url.searchParams.get('origin') || '',
          category: url.searchParams.get('category') || ''
        })
      );
    }

    if (pathname === '/api/diaries') {
      return json(
        res,
        200,
        searchDiaries({
          keyword: url.searchParams.get('keyword') || '',
          sortBy: url.searchParams.get('sortBy') || 'heat'
        })
      );
    }

    if (pathname === '/api/diary-draft' && req.method === 'POST') {
      const body = await readJson(req);
      return json(res, 200, compressDiary(body.text || ''));
    }

    if (pathname.startsWith('/api/diaries/')) {
      const id = decodeURIComponent(pathname.replace('/api/diaries/', ''));
      const result = getDiaryDetail(id);
      return result ? json(res, 200, result) : json(res, 404, { error: 'Diary not found' });
    }

    if (pathname === '/api/foods') {
      return json(
        res,
        200,
        recommendFood({
          query: url.searchParams.get('query') || '',
          cuisine: url.searchParams.get('cuisine') || '',
          near: url.searchParams.get('near') || '',
          k: Number(url.searchParams.get('k') || 10)
        })
      );
    }

    if (pathname.startsWith('/api/foods/')) {
      const id = decodeURIComponent(pathname.replace('/api/foods/', ''));
      const result = getFoodDetail(id);
      return result ? json(res, 200, result) : json(res, 404, { error: 'Food not found' });
    }

    if (pathname.startsWith('/api/pois/')) {
      const id = decodeURIComponent(pathname.replace('/api/pois/', ''));
      const result = getPOIDetail(id);
      return result ? json(res, 200, result) : json(res, 404, { error: 'POI not found' });
    }

    if (pathname === '/api/concert-plan') {
      return json(
        res,
        200,
        concertPlan({
          venue: url.searchParams.get('venue') || '虹馆Live',
          timeLimitMin: url.searchParams.get('timeLimitMin') || '40'
        })
      );
    }

    if (pathname === '/api/profile') return json(res, 200, buildProfile());

    if (pathname === '/api/team-room') {
      return json(res, 200, getTeamRoom(url.searchParams.get('currentNode') || '虹馆Live'));
    }

    return serveStatic(pathname, res);
  } catch (error) {
    return json(res, 500, { error: 'Internal server error', message: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Travel system API running at http://${HOST}:${PORT}`);
});

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function serveStatic(pathname, res) {
  const relativePath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const fullPath = path.normalize(path.join(ROOT_DIR, relativePath));

  if (!fullPath.startsWith(ROOT_DIR)) {
    return json(res, 403, { error: 'Forbidden' });
  }

  try {
    const stat = await fs.stat(fullPath);
    const filePath = stat.isDirectory() ? path.join(fullPath, 'index.html') : fullPath;
    const content = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(content);
  } catch (error) {
    json(res, 404, { error: 'Static file not found', path: pathname });
  }
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}
