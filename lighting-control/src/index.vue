<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<style scoped>
  .content {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>

<script>
  import { WxcButton, WxcMinibar } from 'weex-ui'
  const modal = weex.requireModule('modal');
  import login from './components/login'
  export default {
    data() {
      return {

      }
    },
    components: { WxcButton, login, WxcMinibar }
  }
</script>