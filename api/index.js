import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ANIME } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // چون Gogoanime در لیست شما نبود، از Hianime استفاده می‌کنیم که عالی است
    const animeProvider = new ANIME.Hianime(); 
    
    // متد گرفتن انیمه‌های در حال پخش در Hianime
    const res = await animeProvider.fetchTrendingAnime(); 
    
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
