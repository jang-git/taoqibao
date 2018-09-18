import Main from '@/views/Main';

// 不作为Main组件的子页面展示的页面单独写，如下

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
  },
  component: () => import('@/views/login.vue'),
};
export const locking = {
  path: '/locking',
  name: 'locking',
  component: () => import('@/views/main-components/lockscreen/components/locking-page.vue'),
};
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: Main,
  redirect: '/home',
  children: [
    {
      path: 'home',
      title: '商户中心',
      name: 'home_index',
      component: () => import('@/views/home/home.vue'),
    },
    {
      path: 'setting/bindshop',
      title: '绑定店铺',
      name: 'bindshop',
      component: () => import('@/views/setting/bindshop.vue'),
    },
    // {
    //   path: 'task/step1',
    //   title: '发布任务',
    //   name: 'step1',
    //   component: () => import('@/views/task/step1.vue'),
    // },
    {
      path: 'task/step2/:taskid',
      title: '生成任务',
      name: 'step2',
      component: () => import('@/views/task/step2.vue'),
    },
    {
      path: 'task/step3/:taskid',
      title: '付款并发布',
      name: 'step3',
      component: () => import('@/views/task/step3.vue'),
    },
    {
      path: 'tvmgroup/:id',
      title: '阵列组详情',
      name: 'tvmgroupinfo',
      component: () => import('@/views/tvmgroups/detail.vue'),
    }, // 用于展示带参路由
    // {
    //   path: 'message',
    //   title: '消息中心',
    //   name: 'message_index',
    //   component: resolve => {
    //     require(['@/views/message/message.vue'], resolve);
    //   },
    // },
  ],
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/task',
    icon: 'key',
    name: 'task',
    title: '任务管理',
    component: Main,
    children: [
      { path: 'step1', title: '发布任务', name: 'step1', component: () => import('@/views/task/step1.vue') },
      { path: 'list', title: '任务列表', name: 'listtask', component: () => import('@/views/task/list.vue') },
    ],
  },
  // {
  //   path: '/jdtask',
  //   icon: 'key',
  //   name: 'jdtask',
  //   title: '京东任务管理',
  //   component: Main,
  //   children: [
  //     { path: 'add', title: '发布任务', name: 'add_jdtask', component: () => import('@/views/tbtask/add.vue') },
  //     { path: 'list', title: '任务列表', name: 'list_jdtask', component: () => import('@/views/tvmlive/index.vue') },
  //   ],
  // },
  {
    path: '/capital',
    icon: 'lock-combination',
    title: '账户信息',
    name: 'tvms',
    component: Main,
    children: [
      { path: 'recharge', title: '账号充值', name: 'recharge', component: () => import('@/views/capital/recharge.vue') },
      // { path: 'withdraw', title: '提现', name: 'withdraw_capital', component: () => import('@/views/capital/record.vue') },
      { path: 'record', title: '资金明细', name: 'record_capital', component: () => import('@/views/capital/record.vue') },
    ],
  },
  {
    path: '/drawticket',
    icon: 'document',
    title: '邀请赚元宝',
    name: 'drawticket',
    component: Main,
    children: [
      { path: 'index', title: '邀请商家赚元宝', name: 'drawt', component: () => import('@/views/capital/record.vue') },
      { path: 'index1', title: '邀请奖励记录', name: 'drawticke', component: () => import('@/views/capital/record.vue') },
    ],
  },
  {
    path: '/setting',
    icon: 'earth',
    title: '基本设置',
    name: 'setting',
    component: Main,
    children: [
      {
        path: 'account', title: '安全设置', name: 'account_setting', component: () => import('@/views/setting/account.vue'),
      },
      {
        path: 'shop', title: '店铺管理', name: 'shop_setting', component: () => import('@/views/setting/shop.vue'),
      },
      {
        path: 'index', title: '账户管理', name: 'tvmgroups_index', component: () => import('@/views/setting/shop.vue'),
      },
    ],
  },
  // {
  //   path: '/order',
  //   icon: 'ios-list',
  //   title: '正式订单管理',
  //   name: 'order',
  //   component: Main,
  //   children: [
  //     { path: 'index', title: '正式订单列表', name: 'order_index', component: () => import('@/views/order/index.vue') },
  //   ],
  // },
  // {
  //   path: '/testtask',
  //   icon: 'ios-time-outline',
  //   title: '测试任务管理',
  //   name: 'testtask',
  //   component: Main,
  //   children: [
  //     { path: 'index', title: '测试任务列表', name: 'testtask_list', component: () => import('@/views/testtask/list.vue') },
  //   ],
  // },
  // {
  //   path: '/setting',
  //   icon: 'social-buffer',
  //   title: '系统设置',
  //   name: 'setting',
  //   component: Main,
  //   children: [
  //     {
  //       path: 'area',
  //       title: '地域字典',
  //       name: 'setting_area',
  //       component: () => import('@/views/home/home.vue'),
  //     },
  //     {
  //       path: 'index',
  //       title: '权限管理',
  //       name: 'setting_ctl',
  //       component: () => import('@/views/home/home.vue'),
  //     },
  //     {
  //       path: 'tickets',
  //       title: '票种规格',
  //       name: 'setting_tickets',
  //       component: () => import('@/views/setting/ticketsort.vue'),
  //     },
  //   ],
  // },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  locking,
  ...appRouter,
  // page500,
  // page403,
  // page404,
];
