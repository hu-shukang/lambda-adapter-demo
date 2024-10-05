import { remixFastify } from "@mcansh/remix-fastify";
import { fastify } from "fastify";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

const app = fastify();

await app.register(remixFastify);

let address = await app.listen({ port: 3000, host: "0.0.0.0" });
console.log(`app ready: ${address}`);
