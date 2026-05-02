import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ANIME } from '@consumet/extensions';

const fastify = Fastify({ logger: true });

// ثبت کورس
await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // در سیستم جدید فراخوانی به این شکل است
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

// اکسپورت مخصوص ورسل
export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
