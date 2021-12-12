const redis = require('redis');
const redisClient = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});

redisClient.connect();

redisClient.on('connect', () => {
  console.log('Client connected to redis...');
});

redisClient.on('ready', () => {
  console.log('Client connected to redis and ready to use...');
});

redisClient.on('error', (err) => {
  console.log(err.message);
});

redisClient.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  redisClient.quit();
});

module.exports = {
  redis,
  redisClient,
};
