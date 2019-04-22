const express = require('express');
const router = express.Router();
const auth = require('../src/controllers/auth');
const displayModel = require('../src/models/display');

const unlessPath = {
  path: [
    { url: '/users/login', methods: ['POST'] },
    { url: '/users/register', methods: ['POST']}
  ]
};

router.use(auth.jwtCheck, auth.noAuthenticateCheck, auth.redisCheck);


router.get('/info', (req, res, next) => {

  global.socket.write('get lights');

  global.socket.once('data', function(data) {
    res.send({
      status: 200,
      message: data.toString()
    })
  });


});

router.post('/operation', (req, res, next) => {
  global.socket.write('set lights');

  global.socket.once('data', function (data) {
    res.send({
      status: 200,
      message: data.toString()
    })
  })
});

router.post('/new', (req, res, next) => {
  const d = req.body;
  displayModel.findOne({classroom: d.room}, function (err, display) {

    if(err) {
      console.log(err);
      return res.send({
        status: 500,
        message: "服务器查询错误3"
      });
    }

    if(display) {
      res.send({
        status: 500,
        message: "该教室信息已存在"
      })
    }
    else {
      let newDisplay = new displayModel({
        classroom: d.room,
        display: d.display
      });
      newDisplay.save(function (err, display) {
        if(err) {
          console.log(err);
          res.send({
            status: 500,
            message: "服务器数据库存储错误"
          })
        }
        else {
          //console.log(display);
          res.send({
            status: 200,
            message: `教室 ${display.classroom} 布局信息保存成功`
          })
        }
      })
    }
  })
});

module.exports = router;