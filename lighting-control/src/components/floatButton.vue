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
  const storage = weex.requireModule('storage');

  export default {
    components: {WxcIcon},
    name: "menu",
    methods: {
      handleClick() {
        storage.getItem('token', event => {
          let role = JSON.parse(atob(event.data.split('.')[1])).role;
          if(role >=50 ) {
            this.$router.push('/new');
          }
          else{
            modal.toast({
              message: '权限不足',
              duration: 1
            });
          }
        });

      }
    }
  }

</script>

<style scoped>

</style>