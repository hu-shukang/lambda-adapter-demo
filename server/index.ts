import { remixFastify } from '@mcansh/remix-fastify';
import { fastify } from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

const app = fastify();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await app.register(remixFastify);
app.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  prefix: '/api',
  dirNameRoutePrefix: false,
});
const desiredPort = Number(process.env.PORT) || 3000;
let address = await app.listen({ port: desiredPort, host: '0.0.0.0' });
console.log(`app ready: ${address}`);
