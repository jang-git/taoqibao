// default config
module.exports = {
  workers: 1,
  errnoField: 'code', // errno field
  errmsgField: 'msg', // errmsg field
  // 可以公开访问的Controller
  publicController: [
    // 格式为controller
    'ceo/auth'
  ],

  // 可以公开访问的Action
  publicAction: [
    // 格式为： controller+action
    'ceo/auth/login',
    'pay/notify'
  ]
};
