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
    // طبق خروجی قبلی، ANIME مستقیماً در دسترس است
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
