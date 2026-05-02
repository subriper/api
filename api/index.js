import Fastify from 'fastify';
import cors from '@fastify/cors';
import { META } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

const anilist = new META.Anilist();

// ۱. صفحه اصلی: ترکیب تمام بخش‌های مورد نیاز Zoro
fastify.get('/api/home', async (request, reply) => {
  try {
    const [spotlight, trending, latest, topAiring] = await Promise.all([
      anilist.fetchPopularAnime(1, 10),      // اسلایدر بزرگ بالا
      anilist.fetchTrendingAnime(1, 10),     // بخش پرطرفدارها
      anilist.fetchRecentEpisodes(1, 12),    // قسمت‌های تازه منتشر شده
      anilist.fetchAnilistTrending(1, 10)    // انیمه‌های در حال پخش (Top Airing)
    ]);

    return {
      spotlight: spotlight.results,
      trending: trending.results,
      latestEpisodes: latest.results,
      topAiring: topAiring.results
    };
  } catch (err) {
    return reply.status(500).send({ error: "Failed to fetch home data", details: err.message });
  }
});

// ۲. جستجو: برای نوار سرچ بالای سایت
fastify.get('/api/search/:query', async (request, reply) => {
  try {
    const { query } = request.params;
    const { page = 1 } = request.query;
    const res = await anilist.search(query, page);
    return res;
  } catch (err) {
    return reply.status(500).send({ error: "Search failed", details: err.message });
  }
});

// ۳. جزئیات انیمه و لیست قسمت‌ها: برای صفحه انیمه
fastify.get('/api/info/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    // گرفتن اطلاعات کامل به همراه لیست اپیزودها
    const res = await anilist.fetchAnimeInfo(id);
    return res;
  } catch (err) {
    return reply.status(500).send({ error: "Info fetch failed", details: err.message });
  }
});

// ۴. لینک‌های پخش ویدیو: حیاتی‌ترین بخش برای کلون زورو
fastify.get('/api/watch/:episodeId', async (request, reply) => {
  try {
    const { episodeId } = request.params;
    // دریافت لینک‌های استریم (M3U8)
    const res = await anilist.fetchEpisodeSources(episodeId);
    return res;
  } catch (err) {
    return reply.status(500).send({ error: "Watch link fetch failed", details: err.message });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
