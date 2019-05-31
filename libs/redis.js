const Redis  = require("ioredis")
const config = require("../config/key")
const redis = new Redis(config.redis);

//监听错误
redis.on('error', (err) => {
  console.log(err.toString());
});
//ready事件
redis.on('ready', () => {
  console.log('执行了ready');
});

module.exports = redis

