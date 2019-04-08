<template>
  <div class="floatBtn">
    <Wxc-icon name="add" style="color: #fff" @wxcIconClicked="handleClick">
    </Wxc-icon>
  </div>
</template>

<style scoped>
  .floatBtn {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00B4FF;
    border-radius: 50%;
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
</style>

<script>
  import {WxcIcon} from 'weex-ui'
  const modal = weex.requireModule('modal');
  const toast = message => {
    modal.toast({
      message,
      duration: 1,
    });
  };
  export default {
    components: {WxcIcon},
    name: "menu",
    methods: {
      handleClick() {
        toast('float button clicked');
        this.$router.push('/new')
      }
    }
  }
</script>

<style scoped>

</style>