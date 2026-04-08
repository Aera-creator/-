import { serveStaticFile } from '../lib/http.js';

export async function handleStaticRequest(pathname, rootDir, res) {
  await serveStaticFile(pathname, rootDir, res);
}

