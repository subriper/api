const fastify = require('fastify')({ logger: true });
const { ANIME } = require('@consumet/extensions');

fastify.register(require('@fastify/cors'), { origin: '*' });

// روت تست
fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

// گرفتن انیمه‌های محبوب
fastify.get('/trending', async (request, reply) => {
  try {
    // در نسخه جدید باید مستقیماً از کلاس استفاده کرد
    const gogo = new ANIME.Gogoanime(); 
    const res = await gogo.fetchTopAiring();
    return res;
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ 
      error: 'Failed to fetch data',
      details: err.message 
    });
  }
});

// اکسپورت برای ورسل
module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
