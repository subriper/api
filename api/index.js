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
    // تلاش برای پیدا کردن کلاس در هر کجای پکیج
    const root = consumet.default || consumet;
    
    // پیدا کردن Gogoanime: یا مستقیم در روت است، یا داخل ANIME
    const GogoClass = root.Gogoanime || root.ANIME?.Gogoanime;

    if (!GogoClass) {
      throw new Error("Gogoanime class not found in package");
    }

    const gogo = new GogoClass(); 
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
