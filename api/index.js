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
    // استفاده از AnimeSama که در لیستت بود و معمولاً پایدار است
    const provider = new ANIME.AnimeSama(); 
    
    // اکثر پرووایدرهای این لیست از متد search پشتیبانی قطعی دارند
    // اول با یک سرچ تست می‌کنیم که ببینیم سایت بالاست یا نه
    const res = await provider.search("Naruto");

    return {
      status: "Success",
      provider: "AnimeSama",
      results: res
    };

  } catch (err) {
    return reply.status(500).send({ 
      error: 'Source Blocked or Down',
      details: err.message,
      suggestion: "Try switching to 'AnimeUnity' or 'AnimePahe' in the code."
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
