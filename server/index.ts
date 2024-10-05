import { remixFastify } from '@mcansh/remix-fastify';
import { fastify } from 'fastify';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

const app = fastify();

await app.register(remixFastify);
const desiredPort = Number(process.env.PORT) || 3000;
let address = await app.listen({ port: desiredPort, host: '0.0.0.0' });
console.log(`app ready: ${address}`);
