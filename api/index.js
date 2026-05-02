const fastify = require('fastify')({ logger: true });
const { ANIME } = require('@consumet/extensions');

fastify.register(require('@fastify/cors'), { origin: '*' });

// روت تست
fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

// گرفتن انیمه‌های محبوب از Gogoanime
fastify.get('/trending', async (request, reply) => {
  const gogo = new ANIME.Gogoanime();
  try {
    const res = await gogo.fetchTopAiring();
    return res;
  } catch (err) {
    reply.status(500).send({ error: 'Failed to fetch data' });
  }
});

// اکسپورت مخصوص ورسل
module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}