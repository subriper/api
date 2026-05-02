import Fastify from 'fastify';
import cors from '@fastify/cors';
import { META } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // استفاده از Anilist که دیتای بسیار دقیق و پایداری دارد
    const anilist = new META.Anilist(); 
    
    // گرفتن لیست انیمه‌های ترند روز دنیا
    const res = await anilist.fetchTrendingAnime(1, 10); 
    
    return res;
  } catch (err) {
    return reply.status(500).send({ 
      error: 'Metadata Fetch Error',
      details: err.message
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
