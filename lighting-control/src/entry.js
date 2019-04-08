/*global Vue*/
import Vuex from 'vuex'
/* weex initialized here, please do not move this line */
const { router } = require('./router');
const App = require('@/index.vue');
/* eslint-disable no-new */
new Vue(Vue.util.extend({el: '#root', router}, App));
if (WXEnvironment.platform !== 'Web') {
  Vue.use(Vuex)
}
router.push('/');

