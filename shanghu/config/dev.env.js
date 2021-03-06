const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://127.0.0.1:8360"',
  QN_BASEURL: '"http://pf3ctkfrt.bkt.clouddn.com/"',
});
