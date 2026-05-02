import Fastify from 'fastify';
import cors from '@fastify/cors';
import { META } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

const anilist = new META.Anilist();

fastify.get('/api/home', async (request, reply) => {
  try {
    // استفاده از Promise.allSettled به جای Promise.all 
    // تا اگر یک منبع خراب بود، بقیه بخش‌ها لود شوند
    const results = await Promise.allSettled([
      anilist.fetchPopularAnime(1, 10),
      anilist.fetchTrendingAnime(1, 10),
      anilist.fetchRecentEpisodes(1, 12),
      anilist.fetchTopAiring(1, 10) // نام اصلاح شده متد
    ]);

    const [spotlight, trending, latest, topAiring] = results.map(res => 
      res.status === 'fulfilled' ? res.value.results : []
    );

    return {
      spotlight,
      trending,
      latestEpisodes: latest,
      topAiring
    };
  } catch (err) {
    return reply.status(500).send({ 
      error: "Failed to fetch home data", 
      details: err.message 
    });
  }
});

// روت‌های قبلی (info, search, watch) را هم در ادامه اضافه کن...

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
