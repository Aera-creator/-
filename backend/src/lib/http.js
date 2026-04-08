import fs from 'node:fs/promises';
import path from 'node:path';

export function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

export async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function serveStaticFile(pathname, rootDir, res) {
  const relativePath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const fullPath = path.normalize(path.join(rootDir, relativePath));

  if (!fullPath.startsWith(rootDir)) {
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

