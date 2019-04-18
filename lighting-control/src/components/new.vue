<template>
  <div class="new">
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
                       min="1">
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
                       min="0"
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
                       max="15">
          </wxc-stepper>
        </div>
        <div class="count">
          <div class="text">序列号</div>
          <wxc-stepper :default-value="1"
                       step="1"
                       min="0"
                       max="15">
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
  import { WxcStepper, WxcButton, WxcMinibar } from 'weex-ui';
  export default {
    name: "extend",
    components: { WxcStepper, WxcButton, WxcMinibar},
    data() {
      return {
        lights: [
          {
            row: 1, col: 1, value: 2
          }
        ],  //模拟灯光数据
        light: {
          row: 1,
          col: 1,
          value: 0  //0-空，1-灯灭， 2-灯亮， 3-开关
        }
      }
    },
    methods: {
      calc: function (data) {
        let rmax = 0;
        let cmax = 0;
        data.forEach(function (item) {
          // if (item.value === 1 || item.value === 2 || item.value === 3) {
          //
          // }
          if (item.row > rmax)
            rmax = item.row;
          if (item.col > cmax)
            cmax = item.col;
        });
        return {row: rmax, col: cmax};
      },
      setRow: function (e) {
        this.light.row = e.value;
      },
      setCol: function (e) {
        this.light.col = e.value;
      },
      setValue: function (e) {
        this.light.value = e.value;
      },
      add: function () {
        for (let item of this.lights) {
          if(item.row === this.light.row && item.col === this.light.col){
            item.value = this.light.value;
            return
          }
        }
        this.lights.push({row: this.light.row, col: this.light.col, value: this.light.value})
      },
      commit: function () {
        console.log("commit to server");
      }
    },
    computed: {
      rect: function () {
        let size = this.calc(this.lights);
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
        if(this.lights.length !== 0){
          this.lights.forEach(function (light) {
            bulbs[light.col-1][light.row-1] = light.value;
          });
        }
        return bulbs;
      },
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