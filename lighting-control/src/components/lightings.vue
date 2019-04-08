<template>
  <div class="lighting">
    <div class="nav">
      <Nav></Nav>
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
                    <image v-if="col === 1" style="width: 120px; height: 120px; margin: 20px" :src="offSrc"></image>
                    <image v-if="col === 2" style="width: 120px; height: 120px; margin: 20px" :src="onSrc"></image>
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
  import floatButton from './floatButton'
  import Nav from './nav'
  const dom = weex.requireModule('dom')
  export default {
    name: "lightings",
    data() {
      return {
        lights: [
          {
            row: 1, col: 1, value: 2
          }, {
            row: 1, col: 2, value: 2
          }, {
            row: 1, col: 3, value: 2
          }, {
            row: 1, col: 4, value: 1
          }, {
            row: 1, col: 5, value: 2
          }, {
            row: 1, col: 6, value: 2
          },{
            row: 2, col: 1, value: 2
          }, {
            row: 2, col: 3, value: 2
          }, {
            row: 2, col: 4, value: 2
          },{
            row: 2, col: 5, value: 2
          },{
            row: 2, col: 6, value: 2
          }, {
            row: 3, col: 1, value: 2
          }, {
            row: 3, col: 2, value: 2
          }, {
            row: 3, col: 6, value: 2
          }, {
            row: 4, col: 2, value: 2
          }, {
            row: 4, col: 4, value: 2
          }, {
            row: 4, col: 6, value: 2
          }, {
            row: 5, col: 1, value: 2
          }, {
            row: 5, col: 2, value: 2
          }, {
            row: 5, col: 3, value: 2
          }, {
            row: 5, col: 4, value: 2
          }, {
            row: 5, col: 5, value: 2
          }, {
            row: 5, col: 6, value: 2
          }, {
            row: 6, col: 4, value: 3
          }
        ]  //模拟灯光数据
      }
    },
    components: {floatButton, Nav},
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
  @font-face {
    font-family: 'iconfont';  /* project id 1082858 */
    src: url('//at.alicdn.com/t/font_1082858_bwun2jwz4wr.eot');
    src: url('//at.alicdn.com/t/font_1082858_bwun2jwz4wr.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1082858_bwun2jwz4wr.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1082858_bwun2jwz4wr.woff') format('woff'),
    url('//at.alicdn.com/t/font_1082858_bwun2jwz4wr.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1082858_bwun2jwz4wr.svg#iconfont') format('svg');
  }
</style>