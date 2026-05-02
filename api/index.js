import Fastify from 'fastify';
import cors from '@fastify/cors';
// وارد کردن مستقیم پرووایدرها به جای استفاده از آبجکت ANIME
import { ANIME } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // در نسخه‌های جدید، باید از متغیر داخلی Gogoanime استفاده کرد
    // یا اگر پکیج به صورت کلاس مستقیم است، به این شکل:
    const gogo = new ANIME.Gogoanime(); 
    
    const res = await gogo.fetchTopAiring();
    return res;
  } catch (err) {
    // اگر باز هم ارور داد، این بار چک می‌کنیم Gogoanime کجاست
    return reply.status(500).send({ 
      error: 'Fetch Error',
      details: err.message,
      check: typeof ANIME.Gogoanime // این خط به ما می‌گوید Gogoanime اصلاً چی هست
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
