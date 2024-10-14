import process from 'node:process';
import { remixFastify } from '@mcansh/remix-fastify';
import { fastify } from 'fastify';
import { fastifyAutoload } from '@fastify/autoload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'plugins'),
});

await app.register(remixFastify, {
  getLoadContext: (request) => {
    return { payload: request.payload };
  },
});

const host = process.env.HOST || '127.0.0.1';
const desiredPort = Number(process.env.PORT) || 3000;

const address = await app.listen({ port: desiredPort, host });

console.log(`app ready: ${address}`);
