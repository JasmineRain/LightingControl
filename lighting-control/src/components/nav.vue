<template>
  <div>
    <Wxc-Minibar title="教室"
                 background-color="#009ff0"
                 text-color="#FFFFFF"
                 @wxcMinibarLeftButtonClicked="minibarLeftButtonClick"
                 :bar-style="styles.bar">
    </Wxc-Minibar>
  </div>
</template>

<script>
  import { WxcButton, WxcMinibar } from 'weex-ui'
  const modal = weex.requireModule('modal');
  export default {
    name: "nav",
    data() {
      return {
        styles: {
          bar: {
            height: '80px'
          }
        }
      }
    },
    components: { WxcButton, WxcMinibar },
    methods: {
      minibarLeftButtonClick () {
        modal.toast({ 'message': 'click leftButton!', 'duration': 1 });
      }
    }
  }
</script>

<style scoped>

</style>