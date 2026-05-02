import Fastify from 'fastify';
import cors from '@fastify/cors';
import { META } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

// ساخت اینستنس در داخل روت برای اطمینان از لود شدن کامل متدها
fastify.get('/api/home', async (request, reply) => {
  try {
    const anilist = new META.Anilist();

    // تست برای دیدن اینکه آیا متدها لود شده‌اند یا خیر
    if (typeof anilist.fetchTrendingAnime !== 'function') {
        throw new Error("Library methods are missing after initialization.");
    }

    const [spotlight, trending, latest] = await Promise.all([
      anilist.fetchPopularAnime(1, 10).catch(() => ({ results: [] })),
      anilist.fetchTrendingAnime(1, 10).catch(() => ({ results: [] })),
      anilist.fetchRecentEpisodes(1, 12).catch(() => ({ results: [] }))
    ]);

    return {
      spotlight: spotlight.results || [],
      trending: trending.results || [],
      latestEpisodes: latest.results || [],
      topAiring: trending.results || [] // فالبک به ترندینگ
    };

  } catch (err) {
    return reply.status(500).send({ 
      error: "Initialization Error", 
      details: err.message,
      hint: "Try updating @consumet/extensions to the latest version in package.json"
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
