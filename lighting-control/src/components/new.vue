<template>
  <div class="new">
    <Wxc-loading :show="sending" :need-mask="true" type="trip"></Wxc-loading>
    <div class="nav">
      <Wxc-Minibar title="新建布局"
                   background-color="#009ff0"
                   text-color="#FFFFFF"
                   @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                   :bar-style="{height: '80px'}">
      </Wxc-Minibar>
    </div>
    <div class="display">
      <list class="wrapper" show-scrollbar="false">
        <cell>
          <scroller class="elevator" show-scrollbar="false" scroll-direction="horizontal">
            <div class="row" v-for="(row, rindex) in rect">
              <div class="col" v-for="(col, cindex) in row">
                <image v-if="col === 0" style="width: 120px; height: 120px; margin: 20px" src="#"></image>
                <image v-if="col === 1" style="width: 120px; height: 120px; margin: 20px" :src="offSrc"></image>
                <image v-if="col === 2" style="width: 120px; height: 120px; margin: 20px" :src="onSrc"></image>
                <image v-if="col === 3" style="width: 120px; height: 120px; margin: 20px" :src="switcherSrc"></image>
              </div>
            </div>
          </scroller>
        </cell>
      </list>
      <div class="add">
        <div class="count">
          <div class="text">教室</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="1"
                       @wxcStepperValueChanged="setRoom">
          </wxc-stepper>
        </div>
        <div class="count">
          <div class="text">行</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="1"
                       @wxcStepperValueChanged="setRow">
          </wxc-stepper>
        </div>
        <div class="count">
          <div class="text">列</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="1"
                       @wxcStepperValueChanged="setCol">
          </wxc-stepper>
        </div>
      </div>
      <div class="add">
        <div class="count">
          <div class="text">设备</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="1"
                       max="3"
                       @wxcStepperValueChanged="setValue">
          </wxc-stepper>
        </div>
        <div class="count">
          <div class="text">主机号</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="0"
                       max="15"
                       @wxcStepperValueChanged="setHost">
          </wxc-stepper>
        </div>
        <div class="count">
          <div class="text">序列号</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="0"
                       max="15"
                       @wxcStepperValueChanged="setSeq">
          </wxc-stepper>
        </div>
      </div>
      <div class="btns">
        <div class="btn">
          <WxcButton @wxcButtonClicked="add" text="添加" type="blue" :btn-style="{width: '300px',height: '70px'}"></WxcButton>
        </div>
        <div class="btn">
          <WxcButton @wxcButtonClicked="commit" text="提交" type="blue" :btn-style="{width: '300px',height: '70px'}"></WxcButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { WxcStepper, WxcButton, WxcMinibar, WxcLoading } from 'weex-ui';
  const stream = weex.requireModule('stream');
  const storage = weex.requireModule('storage');
  const modal = weex.requireModule('modal');
  export default {
    name: "extend",
    components: { WxcStepper, WxcButton, WxcMinibar, WxcLoading},
    data() {
      return {
        room: 0,
        display: [
          {
            row: 1, col: 1, value: 2, host: 0, seq: 0
          }
        ],  //模拟灯光数据
        light: {
          row: 1,
          col: 1,
          value: 0,  //0-空，1-灯灭， 2-灯亮， 3-开关
          host: 0,
          seq: 0
        },
        sending: false,
        address: 'http://127.0.0.1',
        port: 3000,
        token: ''
      }
    },
    methods: {

      //动态计算矩阵大小
      calc: function (data) {
        let rmax = 0;
        let cmax = 0;
        data.forEach(function (item) {
          if (item.row > rmax)
            rmax = item.row;
          if (item.col > cmax)
            cmax = item.col;
        });
        return {row: rmax, col: cmax};
      },

      //绑定输入
      setRow: function (e) {
        this.light.row = e.value;
      },
      setCol: function (e) {
        this.light.col = e.value;
      },

      //1-无   2-灯   3-开关
      setValue: function (e) {
        this.light.value = e.value;
      },

      setRoom: function(e) {
        this.room = e.value;
      },
      setHost: function(e) {
        this.light.host = e.value;
      },
      setSeq: function(e) {
        this.light.seq = e.value;
      },

      //实时查看输入
      add: function () {
        for (let item of this.display) {
          if(item.row === this.light.row && item.col === this.light.col){
            item.value = this.light.value;
            return
          }
        }
        this.display.push({
          row: this.light.row,
          col: this.light.col,
          value: this.light.value,
          host: this.light.host,
          seq: this.light.seq
        })
      },

      minibarLeftButtonClick: function () {

      },

      //提交到服务器
      commit: function () {
        if(this.sending)
          return;
        storage.getItem('token', event => {
          console.log('get value:', event.data);
          this.token = event.data;
        });
        this.sending = true;
        const body = JSON.stringify({room: this.room, display: this.display});
        stream.fetch({
          method: 'POST',
          url: this.address + ':' + this.port + '/lights/new',
          type: 'json',
          body: body,
          headers: {'Content-Type': 'application/json', 'Authorization': "Bearer " + this.token}
        }, (res) => {
          this.sending = false;
          if(!res.ok){
            modal.toast({
              message: '请检查网络连接',
              duration: 1
            });
          }
          else{
            //成功
            if(res.data.status === 200) {
              modal.toast({
                message: res.data.message,
                duration: 1
              });
              this.lights = res.data.lights;
            }
            //口令过期或无效
            else if(res.data.status === 401) {
              modal.toast({
                message: res.data.message,
                duration: 1
              });
              this.$router.push('/login');
            }
            //其他错误
            else{
              modal.toast({
                message: res.data.message,
                duration: 1
              });
            }
          }
        });
      }
    },
    computed: {

      //灯光数据调整  因UI显示不同
      rect: function () {
        let size = this.calc(this.display);
        let bulbs = new Array(size.col);
        for(let i =0; i<size.col; i++) {
          bulbs[i] = new Array(size.row);
        }
        for(let i =0; i<size.col; i++) {
          for(let j =0; j<size.row; j++){
            bulbs[i][j] = 0;
          }
        }
        //row=5  col=6
        //1,2 - 2,5 - 2,1
        //1,3 - 3,5 - 3,1
        //1,6 - 6,5 - 6,1
        //2,1 - 1,4 - 1,2
        if(this.display.length !== 0){
          this.display.forEach(function (light) {
            bulbs[light.col-1][light.row-1] = light.value;
          });
        }
        return bulbs;
      },

      //灯光开路径
      onSrc: function () {
        switch (WXEnvironment.platform) {
          case 'Web':
            return "/src/image/display/img_bulb_on.png";
          case 'Android':
            return "file:///android_asset/images/img_bulb_on.png";
          case 'iOS':
            return "local://img_bulb_on.png"
        }
      },

      //灯光关路径
      offSrc: function () {
        switch (WXEnvironment.platform) {
          case 'Web':
            return "/src/image/display/img_bulb_off.png";
          case 'Android':
            return "file:///android_asset/images/img_bulb_off.png";
          case 'iOS':
            return "local://img_bulb_off.png"
        }
      },

      //开关路径
      switcherSrc: function () {
        switch (WXEnvironment.platform) {
          case 'Web':
            return "/src/image/display/img_control.png";
          case 'Android':
            return "file:///android_asset/images/img_control.png";
          case 'iOS':
            return "local://img_control.png"
        }
      }
    }
  }
</script>

<style scoped>
  .new {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .nav {
    height: 80px;
    position: fixed;
    top: 0;
  }
  .display {
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .wrapper {
    height: 600px;
    border: 1px solid #00B4FF;
  }
  .elevator {
    width: 630px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: row;
  }
  .add {
    margin-top: 50px;
    width: 700px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .count {
    width: 220px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text {
    font-size: 40px;
  }
  .btns {
    width: 700px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-top: 50px;
  }
</style>