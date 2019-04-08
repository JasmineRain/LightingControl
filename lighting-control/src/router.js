/*global Vue*/
import Router from 'vue-router'
import Lightings from '@/components/lightings'
import Login from '@/components/login'
import New from '@/components/new'

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'Home',
      component: Lightings
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/new',
      name: 'New',
      component: New
    }
  ]
});
