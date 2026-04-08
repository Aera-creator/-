import http from 'node:http';
import { HOST, PORT, ROOT_DIR } from './config.js';
import { handleApiRequest } from './controllers/apiController.js';
import { handleStaticRequest } from './controllers/staticController.js';
import { createTravelApiService } from './services/travelApiService.js';
import { mockTravelRepository } from './repositories/mockTravelRepository.js';
import { json } from './lib/http.js';

const travelApiService = createTravelApiService(mockTravelRepository);

export function createAppServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const apiHandled = await handleApiRequest(req, pathname, url.searchParams, res, travelApiService);
      if (apiHandled) return;
      await handleStaticRequest(pathname, ROOT_DIR, res);
    } catch (error) {
      json(res, 500, { error: 'Internal server error', message: error.message });
    }
  });
}

export function startServer() {
  const server = createAppServer();
  server.listen(PORT, HOST, () => {
    console.log(`Travel system app running at http://${HOST}:${PORT}`);
  });
  return server;
}

