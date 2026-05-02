import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as consumet from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

// این روت به ما می‌گوید که پکیج دقیقاً شامل چه چیزهایی است
fastify.get('/debug', async () => {
  return {
    keys: Object.keys(consumet),
    hasDefault: !!consumet.default,
    defaultKeys: consumet.default ? Object.keys(consumet.default) : []
  };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // تلاش برای پیدا کردن کلاس به روش‌های مختلف
    const mainExport = consumet.default || consumet;
    const ANIME_PROVIDERS = mainExport.ANIME || mainExport.default?.ANIME;

    if (!ANIME_PROVIDERS || !ANIME_PROVIDERS.Gogoanime) {
      // اگر پیدا نشد، ساختار را در ارور برگردان تا ببینیم مشکل چیست
      throw new Error(`Structure not found. Available: ${Object.keys(mainExport).join(', ')}`);
    }

    const gogo = new ANIME_PROVIDERS.Gogoanime(); 
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
