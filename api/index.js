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
    const animeProvider = new ANIME.AnimePahe(); 
    
    // متد search در تمام پرووایدرها مشترک است
    const res = await animeProvider.search("One Piece"); 
    
    return res;
  } catch (err) {
    // اگر باز هم ارور داد، لیست تمام متدهای در دسترس این کلاس را چاپ می‌کنیم
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(new ANIME.AnimePahe()));
    return reply.status(500).send({ 
      error: 'Fetch Error',
      details: err.message,
      availableMethods: methods // اینجا لیست تمام کارهایی که این کلاس می‌تواند انجام دهد را می‌بینیم
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
