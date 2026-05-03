import Fastify from 'fastify';
import cors from '@fastify/cors';
import { META, ANIME } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

const anilist = new META.Anilist();
const zoro = new ANIME.Zoro(); // اضافه کردن پرووایدر اختصاصی زورو

fastify.get('/api/home', async (request, reply) => {
  try {
    // منطق اصلی ریپازیتوری aniwatch-api: اولویت با دیتای زورو
    const [zoroHome, trending] = await Promise.allSettled([
      zoro.fetchHomePage(), // این متد دقیقاً دیتای صفحه اول زورو را می‌دهد
      anilist.fetchTrendingAnime(1, 10)
    ]);

    return {
      // اگر دیتای اختصاصی زورو لود شد، از آن استفاده کن، در غیر این صورت فالبک به آنی‌لیست
      spotlight: zoroHome.status === 'fulfilled' ? zoroHome.value.spotlight : [],
      trending: trending.status === 'fulfilled' ? trending.value.results : [],
      latestEpisodes: zoroHome.status === 'fulfilled' ? zoroHome.value.latestEpisodes : [],
      topAiring: zoroHome.status === 'fulfilled' ? zoroHome.value.topAiring : []
    };
  } catch (err) {
    return reply.status(500).send({ error: err.message });
  }
});

// روت اختصاصی برای گرفتن لینک پخش (مشابه منطق aniwatch-api)
fastify.get('/api/watch/:episodeId', async (request, reply) => {
  try {
    const { episodeId } = request.params;
    // زورو معمولاً چندین سرور (StreamSB, VidCloud) می‌دهد
    const res = await zoro.fetchEpisodeSources(episodeId);
    return res;
  } catch (err) {
    return reply.status(500).send({ error: "Servers are busy, try again." });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
