import Fastify from 'fastify';
import cors from '@fastify/cors';
// وارد کردن مستقیم کلاس از مسیر دقیق پکیج
import { Gogoanime } from '@consumet/extensions/dist/providers/anime/gogoanime.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // حالا مستقیم از کلاسی که ایمپورت کردیم استفاده می‌کنیم
    const gogo = new Gogoanime(); 
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
