import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';

import env from '../../build/env';

const util = {};
util.title = function (title) {
  title = title || '大麦管理系统';
  window.document.title = title;
};

util.timetoDate = function(timestring) {
  const time = Number(timestring) * 1000;
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};
const ajaxUrl =
  env === 'development'
    ? 'http://127.0.0.1:8888'
    : env === 'production' ? 'https://www.url.com' : 'https://debug.url.com';

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000,
});

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  }
  return false;
};

util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === 'object' && itAccess.isArray()) {
    return util.oneOf(currentAccess, itAccess);
  }
  return itAccess === currentAccess;
};

util.getRouterObjByName = function (routers, name) {
  let routerObj = {};
  routers.forEach(item => {
    if (item.name === 'otherRouter') {
      item.children.forEach((child, i) => {
        if (child.name === name) {
          routerObj = item.children[i];
        }
      });
    } else if (item.children.length === 1) {
      if (item.children[0].name === name) {
        routerObj = item.children[0];
      }
    } else {
      item.children.forEach((child, i) => {
        if (child.name === name) {
          routerObj = item.children[i];
        }
      });
    }
  });
  return routerObj;
};

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  }
  return item.title;
};

util.setCurrentPath = function (vm, name) {
  let title = '';
  let isOtherRouter = false;
  
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === 'otherRouter') {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      });
    }
  });

  
  let currentPathArr = [];
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index'),
        ),
        path: '',
        name: 'home_index',
      },
    ];
  } else if (
    (name.indexOf('_index') >= 0 || isOtherRouter) &&
    name !== 'home_index'
  ) {
    
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index'),
        ),
        path: '/home',
        name: 'home_index',
      },
      {
        title,
        path: '',
        name,
      },
    ];
  } else {
    const currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      }
      let i = 0;
      const childArr = item.children;
      const len = childArr.length;
      while (i < len) {
        if (childArr[i].name === name) {
          return true;
        }
        i++;
      }
      return false;
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index',
        },
      ];
    } else if (
      currentPathObj.children.length <= 1 &&
      currentPathObj.name !== 'home'
    ) {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index',
        },
        {
          title: currentPathObj.title,
          path: '',
          name,
        },
      ];
    } else {
      const childObj = currentPathObj.children.filter(child => child.name === name)[0];
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index',
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name,
        },
        {
          title: childObj.title,
          path: `${currentPathObj.path}/${childObj.path}`,
          name,
        },
      ];
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
  const pageOpenedList = vm.$store.state.app.pageOpenedList;
  const openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu,
        query,
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter(item => {
      if (item.children) {
        return name === item.children[0].name;
      }
      return name === item.name;
    });
    tag = tag[0];
    tag = tag.children ? tag.children[0] : tag;
    if (argu) {
      tag.argu = argu;
    }
    if (query) {
      tag.query = query;
    }
    vm.$store.commit('increateTag', tag);
  }
  vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
  const len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routers[i].name === name && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name,
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

util.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage');
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist');
  // 全屏相关
};

util.getHeader = function (){
  const local = Cookies.get('token');
  let res = {};
  if (local) {
    res = {
      "x-taskplatform-token": local,
    }
  }
  return res;
  // return JSON.stringify(res);
}
export default util;
