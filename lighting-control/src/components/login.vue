<template>
  <div class="content">
    <div class="logo">
      <image style="width: 138px; height: 138px" :src="bulbSrc"></image>
    </div>
    <div class="input-panel">
      <div class="row">
        <input class="input" type="text" placeholder="账号" style="placeholder-color: #b0b0b0"/>
        <image style="width: 35px; height: 35px" :src="deleteSrc"></image>
      </div>
      <div class="row">
        <input class="input" type="password" placeholder="密码" style="placeholder-color: #b0b0b0"/>
        <image style="width: 35px; height: 35px" :src="deleteSrc"></image>
      </div>
    </div>
    <div class="submit">
      <div class="btn">
        <WxcButton text="登陆" type="blue" :btn-style="styles.logBtn" @wxcButtonClicked="login"></WxcButton>
      </div>
    </div>
  </div>
</template>

<script>
  import { WxcButton } from 'weex-ui';
  const modal = weex.requireModule('modal');
  const toast = message => {
    modal.toast({
      message,
      duration: 1,
    });
  };
  export default {
    data() {
      return {
        styles: {
          logBtn: {
            width: '450px',
            height: '70px'
          }
        }
      }
    },
    name: "login",
    components: {WxcButton},
    methods: {
      login: function () {
        toast('login button clicked');
        this.$router.push('/home')
      }
    },
    computed: {
      bulbSrc: function () {
        switch (WXEnvironment.platform) {
          case 'Web':
            return "/src/image/login/img_bulb.png";
          case 'Android':
            return "file:///android_asset/images/img_bulb.png";
          case 'iOS':
            return "local://img_bulb.png"
        }
      },
      deleteSrc: function () {
        switch (WXEnvironment.platform) {
          case 'Web':
            return "/src/image/login/btn_delete.png";
          case 'Android':
            return "file:///android_asset/images/btn_delete.png";
          case 'iOS':
            return "local://btn_delete.png"
        }
      }
    }
  }
</script>

<style scoped>
  .logo {
    width: 140px;
    height: 140px;
    margin: 20px
  }
  .content {
    position: absolute;
    top: 150px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .input-panel {
    width: 700px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 150px;
  }
  .submit {
    width: 700px;
    height: 70px;
    margin: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn {
    width: 450px;
    height: 70px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .input {
    width: 350px;
    height: 70px;
    font-size: 40px;
    padding: 10px;
    border-bottom-style: solid;
    border-bottom-color: #00b4ff;
    border-bottom-width: 1px;
  }
</style>