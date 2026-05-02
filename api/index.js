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
    // استفاده از AnimePahe که در لیست موجودی‌های شما بود
    const animeProvider = new ANIME.AnimePahe(); 
    
    // متد استاندارد برای این پرووایدر
    const res = await animeProvider.fetchLatestAnime(); 
    
    return res;
  } catch (err) {
    return reply.status(500).send({ 
      error: 'Fetch Error',
      details: err.message,
      note: "If fetchLatestAnime failed, trying to list available methods might help."
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
