const fastify = require('fastify')({ logger: true });
// وارد کردن مستقیم کلاس Gogoanime از داخل پوشه توزیع پکیج
const { Gogoanime } = require('@consumet/extensions/dist/providers/anime/gogoanime');

fastify.register(require('@fastify/cors'), { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // حالا مستقیم از کلاسی که بالا گرفتیم استفاده می‌کنیم
    const gogo = new Gogoanime(); 
    const res = await gogo.fetchTopAiring();
    return res;
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ 
      error: 'Failed to fetch data from Gogoanime',
      details: err.message 
    });
  }
});

module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
