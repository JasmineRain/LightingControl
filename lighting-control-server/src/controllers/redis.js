const redis = require('redis');
const redisClient = redis.createClient(6379);
const expire = 60*60;


redisClient.on('error', function (err) {
  console.log('redis Error:' + err);
});

redisClient.on('ready', function(res){
  console.log('redis ready');
});

module.exports =  {
  add(key, value) {
    redisClient.set(key, value, redis.print);
    redisClient.expire(key, expire)
  },
  updateExpire(key) {
    redisClient.expire(key, expire)
  },
  get(key,callback) {
    redisClient.get(key,(err,data)=>{
      if(err)
        console.log(err);
      callback(data)
    })
  },
  remove(key){
    redisClient.del(key)
  }
};