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
    // ۱. پیدا کردن روت اصلی پکیج
    const root = consumet.default || consumet;
    
    // ۲. پیدا کردن آبجکت ANIME
    const animeProviders = root.ANIME || root.default?.ANIME;

    // ۳. استخراج کلاس Gogoanime (با تست کردن هر دو حالت مستقیم و تودرتو)
    const GogoClass = animeProviders?.Gogoanime || root.Gogoanime;

    if (!GogoClass) {
      // اگر باز هم پیدا نشد، تمام کلیدهای موجود را برگردان تا ببینیم کجاست
      const available = Object.keys(animeProviders || {});
      throw new Error(`Gogoanime not found. Available in ANIME: ${available.join(', ')}`);
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
