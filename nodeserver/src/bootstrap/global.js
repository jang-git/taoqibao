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

global.selectPrice = function(price) {
  const priceList = [0, 100, 200, 300, 400, 500, 600];
  const reward = [1, 2, 3, 4, 5, 6];
  // 二分法
  const bin = function binarySearch(arr, findVal, leftIndex, rightIndex) {
    if (leftIndex > rightIndex) {
      var find = leftIndex - 1;
      return find;
    }
    var midIndex = Math.floor((leftIndex + rightIndex) / 2);
    var midVal = arr[midIndex];
    console.log('console:::::::', midVal);
    if (midVal > findVal) {
      return binarySearch(arr, findVal, leftIndex, midIndex - 1);
    } else if (midVal < findVal) {
      return binarySearch(arr, findVal, midIndex + 1, rightIndex);
    } else {
      const find = midIndex - 1;
      return find;
    }
  };

  return bin(priceList, price, 0, 6);
  // return reward[bin(priceList, price, 0, priceList.length)];
};
