import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as consumet from '@consumet/extensions';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // پیدا کردن کلاس Gogoanime به هر شکلی که صادر شده باشد
    const ANIME = consumet.ANIME || consumet.default?.ANIME;
    
    if (!ANIME || !ANIME.Gogoanime) {
      throw new Error("Provider Gogoanime not found in package structure");
    }

    const gogo = new ANIME.Gogoanime(); 
    const res = await gogo.fetchTopAiring();
    return res;
  } catch (err) {
    return reply.status(500).send({ 
      error: 'Fetch Error',
      details: err.message 
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
