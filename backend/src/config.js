import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PORT = Number(process.env.PORT || 3000);
export const HOST = process.env.HOST || '127.0.0.1';
export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

