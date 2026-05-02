import Fastify from 'fastify';
import cors from '@fastify/cors';
import { META } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

const anilist = new META.Anilist();

fastify.get('/api/home', async (request, reply) => {
  try {
    // تابعی کمکی برای اجرای ایمن متدها
    const safeFetch = async (methodName, ...args) => {
      if (typeof anilist[methodName] === 'function') {
        const res = await anilist[methodName](...args);
        return res.results || [];
      }
      return [];
    };

    // اجرای هوشمند متدها بر اساس نام‌های احتمالی در نسخه‌های مختلف Consumet
    const [spotlight, trending, latest, topAiring] = await Promise.all([
      safeFetch('fetchPopularAnime', 1, 10),
      safeFetch('fetchTrendingAnime', 1, 10),
      safeFetch('fetchRecentEpisodes', 1, 12),
      // اگر fetchTopAiring نبود، دوباره از محبوب‌ها یا یک متد عمومی استفاده می‌کند
      safeFetch('fetchTopAiring', 1, 10).then(res => res.length ? res : safeFetch('fetchAnilistTrending', 1, 10))
    ]);

    return {
      spotlight,
      trending,
      latestEpisodes: latest,
      topAiring: topAiring.length ? topAiring : spotlight // Fallback به spotlight اگر خالی بود
    };
  } catch (err) {
    // اگر باز هم خطای عجیبی داد، متدهای در دسترس را لیست کن تا ببینیم اسمش چیست
    const availableMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(anilist));
    return reply.status(500).send({ 
      error: "Method Mapping Error", 
      details: err.message,
      available: availableMethods 
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
