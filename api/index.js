import Fastify from 'fastify';
import cors from '@fastify/cors';
// مستقیم کلاس گگو-انیمه را بیرون می‌کشیم
import { Gogoanime } from '@consumet/extensions';

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // چون مستقیم ایمپورت شده، دیگر نیازی به ANIME. نیست
    const gogo = new Gogoanime(); 
    const res = await gogo.fetchTopAiring();
    return res;
  } catch (err) {
    return reply.status(500).send({ 
      error: 'Fetch Error',
      details: err.message,
      // اگر باز هم ارور داد، ببینیم خود Gogoanime چیست
      typeOfGogo: typeof Gogoanime 
    });
  }
});

export default async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
