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

router.use(auth.jwtCheck.unless(unlessPath), auth.noAuthenticateCheck, auth.redisCheck.unless(unlessPath));

router.post('/register', (req, res, next) => {
  const u = req.body;
  userModel.findOne({username: u.username}, function (err, user) {
    if(err) {
      console.log(err);
      return res.send({
        status: 500,
        message: "服务器查询错误1"
      });
    }

    if(user) {
      res.send({
        status: 500,
        message: "重复的用户名"
      })
    }
    else {
      let user = new userModel({
        username: u.username,
        password: u.password
      });
      user.save(function (err, user) {
        if(err) {
          console.log(err);
          res.send({
            status: 500,
            message: "服务器数据库存储错误"
          })
        }
        else {
          res.send({
            status: 200,
            message: "注册成功 " + user.username
          })
        }
      })
    }
  });

});

router.post('/login', (req, res, next) => {
  const u = req.body;
  userModel.findOne({username: u.username}, function (err, user) {
    if(err) {
      return res.send({
        status: 500,
        message: "服务器查询错误2"
      })
    }
    if(!user) {
      return res.send({
        status: 500,
        message: "用户不存在"
      })
    }
    else {
      user.comparePassword(u.password, function (err, isMatch) {
        if(err) {
          return res.send({
            status: 500,
            message: "密码比对时出错"
          })
        }
        if(isMatch) {
          let info = {
            name: u.username,
            role: user.role
          };
          const token = auth.sign(info);
          auth.addRedis(token, {user: u.username, role: user.role});
          console.log("用户登入: " + u.username);
          res.send({
            status: 200,
            token: token,
            message: "登陆成功"
          })
        }
        else {
          res.send({
            status: 500,
            message: "密码错误"
          })
        }
      })
    }
  });
});

router.post('/logout', (req, res, next) => {
  auth.removeRedis(req);
  console.log("用户登出: " + req.user.username);
  res.send({
    status: 200,
    message: "注销成功"
  })
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;