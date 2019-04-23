<template>
  <div class="content">
    <Wxc-loading :show="loading" :need-mask="true" type="trip"></Wxc-loading>
    <div class="logo">
      <image style="width: 138px; height: 138px" :src="bulbSrc"></image>
    </div>
    <div class="input-panel">
      <div class="row">
        <input @change="setUsername" class="input" type="text" placeholder="账号" style="placeholder-color: #b0b0b0"/>
        <image style="width: 35px; height: 35px" :src="deleteSrc"></image>
      </div>
      <div class="row">
        <input @change="setPassword" class="input" type="password" placeholder="密码" style="placeholder-color: #b0b0b0"/>
        <image style="width: 35px; height: 35px" :src="deleteSrc"></image>
      </div>
    </div>
    <div class="submit">
      <div class="btn">
        <WxcButton text="登陆" type="blue" :btn-style="{width: '450px',height: '70px'}" @wxcButtonClicked="login"></WxcButton>
      </div>
    </div>
  </div>
</template>

<script>
  import { WxcButton, WxcLoading } from 'weex-ui';
  const modal = weex.requireModule('modal');
  const stream = weex.requireModule('stream');
  const storage = weex.requireModule('storage');

  export default {
    data() {
      return {
        username: '',
        password: '',
        loading: false,
        address: 'http://127.0.0.1',
        port: 3000
      }
    },
    name: "login",
    components: {WxcButton, WxcLoading},
    methods: {
      setUsername: function (e) {
        this.username = e.value;
      },
      setPassword: function (e) {
        this.password = e.value;
      },
      login: function () {
        if(this.username ==='' || this.password === '') {
          modal.toast({
            message: '账号名或密码不能为空',
            duration: 1
          });
          return;
        }
        if(this.loading)
          return;
        this.loading = true;
        const body = JSON.stringify({username: this.username, password: this.password});
        stream.fetch({
          method: 'POST',
          url: this.address + ':' + this.port + '/users/login',
          type: 'json',
          body: body,
          headers: {'Content-Type': 'application/json'}
        }, (res) => {
          this.loading = false;
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
              storage.setItem('token', res.data.token, event => {
                this.$router.push('/home');
              });

            }
            //错误
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
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 150px;
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