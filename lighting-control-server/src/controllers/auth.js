const express_jwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const redis = require('./redis');
const unless = require('express-unless');

const SECRET = 'QWER!@#$1234';

const getToken = function (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

const auth = {

  sign: user => {
    return jwt.sign(user, SECRET);
  },

  addRedis: (key, filed, value) => {
    redis.add(key, filed, value);
  },

  removeRedis: key => {
    key && redis.remove(key);
  },

  jwtCheck: express_jwt({
    secret: SECRET,
    getToken: getToken
  }),

  noAuthenticateCheck: (err, req, res, next) => {
    if (err.status === 401) {
      res.send({
        status: 401,
        message: "无效口令，请重新登陆"
      });
    }
    else
      next()
  },

  redisCheck: (req, res, next) => {
    let key = req.user.name;
    let field = "token";
    let token = getToken(req);
    redis.get(key, field, data => {
      if (data && data === token) {
        redis.updateExpire(key);
        next();
      } else {
        res.send({
          status: 400,
          message: "无效口令，请重新登陆"
        })
      }
    })
  },

};

auth.redisCheck.unless = unless;

module.exports = auth;