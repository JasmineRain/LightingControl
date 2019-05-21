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

  global.socket.write(`\t{"type": "GET"}\n`);

  global.socket.once('data', function(data) {

    let code = JSON.parse(data).status;

    console.log(data.toString());

    if(code === 'error'){
      return res.send({
        status: 500,
        message: "获取灯光信息失败"
      });
    }

    console.log(data.toString());

    //处理主机号序列号与行列号关系并返回
    let classroom = JSON.parse(data).classroom || 4;
    displayModel.findOne({classroom: classroom}, function (err, display) {
      let info = [];
      if(err) {
        console.log(err);
        return res.send({
          status: 500,
          message: "服务器查询错误3"
        });
      }

      if(display) {
        let d =display.display;
        let lights = JSON.parse(data).lights;
        lights.forEach(function (item) {
          let e = d.find(function (element) {
            return element.host === item.host && element.seq === item.seq;
          });
          if(e) {
            info.push({
              row: e.row, col: e.col, sw: item.sw === 1 ?  1 : 0, host: item.host, seq: item.seq
            })
          }
        });

        // //加入开关位置
        // let switcher = d.find(function (element) {
        //   return element.value === 2;
        // });
        // if(switcher) {
        //   info.push({
        //     row: switcher.row, col: switcher.col, sw: switcher.value
        //   })
        // }
      }
      res.send({
        status: 200,
        lights: info,
        message: '获取灯光信息成功'
      })
    });
  });
});

router.post('/operation', (req, res, next) => {

  if(req.body.type === 'ON_ALL' || req.body.type === 'OFF_ALL') {
    global.socket.write( `\t { "type": "SET_TURN_${req.body.type}" } \n` );

    global.socket.once('data', function (data) {

      console.log(data.toString());

      let code = JSON.parse(data).status;
      if(code === 'error'){
        return res.send({
          status: 500,
          message: "设置灯光失败"
        });
      }

      console.log(data.toString());

      res.send({
        status: 200,
        message: '设置灯光成功'
      })
    })

  }else {
    global.socket.write(`\t{"type": "SET_TURN_${req.body.type}", "host":${req.body.host}, "seq": ${req.body.seq}}}\n`);

    global.socket.once('data', function (data) {

      let code = JSON.parse(data).status;
      if(code === 'error'){
        return res.send({
          status: 500,
          message: "设置灯光失败"
        });
      }

      console.log(data.toString());

      res.send({
        status: 200,
        message: '设置灯光成功'
      })
    })
  }

});

router.post('/new', (req, res, next) => {
  const d = req.body;
  displayModel.findOne({classroom: d.room}, function (err, display) {

    if(err) {
      console.log(err);
      return res.send({
        status: 500,
        message: "服务器查询错误4"
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