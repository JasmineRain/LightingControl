<template>
  <div class="lighting">
    <Wxc-loading :show="loading" :need-mask="true" type="trip"></Wxc-loading>
    <div class="nav">
      <Wxc-Minibar title="教室1"
                   background-color="#009ff0"
                   text-color="#FFFFFF"
                   leftButton=""
                   :bar-style="{height: '80px'}">
      </Wxc-Minibar>
    </div>
    <div class="bulb">
      <div class="index_bar">
        <div style="width: 70px; height: 70px"></div>
        <!--<scroller class="cidx" scroll-direction="horizontal" ref="col" show-scrollbar="false" @scroll="handleIndexRowScroll">-->
          <!--<div class="cidx_item" v-for="cidx in rect[0].length" :ref="'col'+cidx">-->
            <!--<text>{{cidx}}</text>-->
          <!--</div>-->
        <!--</scroller>-->
      </div>
      <div class="dis_info">
        <!--<div class="left">-->
          <!--<scroller class="ridx" ref="row" show-scrollbar="false" @scroll="handleIndexColScroll">-->
            <!--<div class="ridx_item" v-for="ridx in rect.length" :ref="'row'+ridx">-->
              <!--<text>{{ridx}}</text>-->
            <!--</div>-->
          <!--</scroller>-->
        <!--</div>-->
        <div class="right">
          <list class="wrapper" show-scrollbar="false">
            <cell>
              <scroller class="elevator" show-scrollbar="false" scroll-direction="horizontal">
                <div class="row" v-for="(row, rindex) in rect">
                  <div class="col" v-for="(col, cindex) in row">
                    <!--<text>aaa</text>-->
                    <image v-if="col === 0" style="width: 120px; height: 120px; margin: 20px" src="#"></image>
                    <image @click="clickBulb({row: cindex + 1, col: rindex + 1, value: col})" v-if="col === 1" style="width: 120px; height: 120px; margin: 20px" :src="offSrc"></image>
                    <image @click="clickBulb({row: cindex + 1, col: rindex + 1, value: col})" v-if="col === 2" style="width: 120px; height: 120px; margin: 20px" :src="onSrc"></image>
                    <image v-if="col === 3" style="width: 120px; height: 120px; margin: 20px" :src="switcherSrc"></image>
                  </div>
                </div>
              </scroller>
            </cell>
          </list>
        </div>
      </div>
    </div>
    <floatButton></floatButton>
  </div>
</template>

<script>
  import floatButton from './floatButton';
  import { WxcMinibar, WxcLoading } from 'weex-ui';
  const modal = weex.requireModule('modal');
  const stream = weex.requireModule('stream');
  const storage = weex.requireModule('storage');
  export default {
    name: "lightings",
    data() {
      return {
        lights: [],  //模拟灯光数据
        loading: false,
        address: 'http://127.0.0.1',
        port: 3000,
        token: ''
      }
    },
    components: {floatButton, WxcMinibar, WxcLoading},
    methods: {
      calc: function (data) {
        let rmax = 0;
        let cmax = 0;
        data.forEach(function (item) {
          if (item.value === 1 || item.value === 2 || item.value === 3) {
            if (item.row > rmax)
              rmax = item.row;
            if (item.col > cmax)
              cmax = item.col;
          }
        });
        return {row: rmax, col: cmax};
      },

      minibarLeftButtonClick: function () {
        console.log("click back at home page");
      },

      getLightsInfo: function () {
        this.loading = true;
        storage.getItem('token', event => {
          this.token = event.data;
        });
        stream.fetch({
          method: 'GET',
          url: this.address + ':' + this.port + '/lights/info',
          type: 'json',
          headers: {'Authorization': "Bearer " + this.token}
        }, (res) => {
          this.loading = false;
          if(!res.ok){
            modal.toast({
              message: '请检查网络连接',
              duration: 1
            });
          }
          else{
            console.log(res.data);
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
      },

      clickBulb: function (info) {
        console.log(info);
        this.loading = true;
        storage.getItem('token', event => {
          this.token = event.data;
        });
        let index = this.lights.findIndex(function (light) {
          return light.row === info.row && light.col === info.col
        });
        const body = JSON.stringify({type: info.value === 1? 'ON' : 'OFF' ,host: this.lights[index].host, seq: this.lights[index].seq});
        stream.fetch({
          method: 'POST',
          url: this.address + ':' + this.port + '/lights/operation',
          type: 'json',
          body: body,
          headers: {'Authorization': "Bearer " + this.token, 'Content-Type': 'application/json'}
        }, (res) => {
          this.loading = false;
          if(!res.ok){
            modal.toast({
              message: '请检查网络连接',
              duration: 1
            });
          }
          else{
            console.log(res.data);
            //成功
            if(res.data.status === 200) {
              modal.toast({
                message: res.data.message,
                duration: 1
              });
              this.lights[index].value = info.value === 1? 2 : 1
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

      // handleTableRowScroll: function (e) {
      //   let c = this.$refs.col1;
      //   dom.scrollToElement(c, {offset: e.contentOffset.x - 20});
      // },
      // handleTableColScroll: function (e) {
      //   let r = this.$refs.row1;
      //   dom.scrollToElement(r, {offset: - e.contentOffset.y - 20});
      // },
      // handleIndexRowScroll: function (e) {
      //
      // },
      // handleIndexColScroll: function (e) {
      //
      // }
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
        this.lights.forEach(function (light) {
          bulbs[light.col-1][light.row-1] = light.value;
        });
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
    },
    mounted() {
      this.getLightsInfo();
    }
  }
</script>

<style scoped>
  .lighting {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav {
    height: 80px;
    position: fixed;
    top: 0;
  }
  .bulb {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .index_bar {
    display: flex;
    flex-direction: row;
  }
  .cidx {
    width: 630px;
    height: 70px;
    display: flex;
    flex-direction: row;
  }
  .cidx_item {
    width: 120px;
    height: 30px;
    margin: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ridx {
    width: 70px;
    height: 700px;
    display: flex;
    flex-direction: column;
  }
  .ridx_item {
    width: 30px;
    height: 120px;
    margin: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dis_info {
    width: 700px;
    height: 700px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .left {
    width: 70px;
    height: 700px;
  }
  .right {
    /*width: 630px;*/
    height: 700px;
  }
  .wrapper {
    height: 700px;
    border: solid 1px #00B4FF;
  }
  .elevator {
    width: 650px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: row;
  }
</style>