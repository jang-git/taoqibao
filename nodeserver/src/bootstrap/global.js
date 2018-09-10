/**
 * 生成token GUID去除横线格式
 */
global.createToken = function() {
  return (think.uuid('v4')).replace(/-/g, '');
};

global.sleep = function(time = 10000) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, time);
  });
};
/**
 * 获取当前时间的秒数
 */
global.currentTime = function() {
  const timedate = Date.parse(new Date());
  return timedate / 1000;
};
