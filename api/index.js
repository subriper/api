const fastify = require('fastify')({ logger: true });
const consumet = require('@consumet/extensions');

fastify.register(require('@fastify/cors'), { origin: '*' });

fastify.get('/', async () => {
  return { message: 'API is running! 🚀' };
});

fastify.get('/trending', async (request, reply) => {
  try {
    // تست کردن مسیرهای مختلف لود شدن پکیج
    const ANIME = consumet.ANIME || consumet.default?.ANIME;
    
    if (!ANIME) {
      throw new Error("Could not find ANIME providers in package");
    }

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

module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
