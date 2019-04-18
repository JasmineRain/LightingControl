const express = require('express');
const router = express.Router();
const auth = require('../src/controllers/auth');
const userModel = require('../src/models/user');

const unlessPath = {
  path: [
    { url: '/users/login', methods: ['POST'] },
    { url: '/users/register', methods: ['POST']}
  ]
};

router.use(auth.jwtCheck, auth.noAuthenticateCheck, auth.redisCheck);


router.get('/info', (req, res, next) => {
  res.send({
    status: 200,
    message: "返回灯光数据"
  })
});


module.exports = router;