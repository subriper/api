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
    // استفاده از Hianime که در لیست موجودی‌هایت بود و پایدار است
    const animeProvider = new ANIME.Hianime(); 
    
    // استفاده از متدی که در مرحله قبل شناسایی کردیم
    const res = await animeProvider.fetchRecentEpisodes(); 
    
    return res;
  } catch (err) {
    // اگر باز هم به مشکل شبکه خورد، یکی دیگر از پرووایدرهای لیستت را امتحان می‌کنیم
    return reply.status(500).send({ 
      error: 'API Connection Error',
      details: err.message,
      suggestion: "If this persists, the provider site might be down."
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
