import Vue from 'vue';
import iView from 'iview';
import Cookies from 'js-cookie';
// import Util from '../libs/util';
import Router from 'vue-router';
import { routers } from './router';

Vue.use(Router);

// 路由配置
const RouterConfig = {
  linkActiveClass: 'active',
  // mode: 'history',
  routes: routers,
};

export const router = new Router(RouterConfig);

//  default router;
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  if (!Cookies.get('token') && to.name !== 'login') {
    // 判断是否已经登录且前往的页面不是登录页
    next({ name: 'login' });
  } else if (Cookies.get('token') && to.name === 'login') {
    // 判断是否已经登录且前往的是登录页
    next({ name: 'home_index' });
  } else {
    next();
  }
  // next();
  // console.log(Cookies.get('password'));
  iView.LoadingBar.finish();
});

router.afterEach(() => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
