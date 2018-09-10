<template>
  <div>
    <div class="areaselect" >
      <div class="selectarea" @click="show">{{city}}</div>
      <div v-if="showSelect" class="block-area">
      <div class="boxcontent">
        <ul class="list-inline">
          <li @click="chooseCity('全国')">全国</li>
        </ul>
        <ul class="list-inline">
            <li v-for="(item,index) in data" @click="chooseCity(item)" :key="index">{{item}}</li>
        </ul>
        <ul class="list-inline">
            <li v-for="(item,index) in data1" @click="chooseCity(item)" :key="index">{{item}}</li>
        </ul>
        <ul class="list-inline">
            <li v-for="(item,index) in data2" @click="chooseCity(item)" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'shoparea',
  props: ['city'],
  data() {
    return {
      // city: '全国',
      data: ['北京', '上海', '广州', '深圳', '杭州', '海外', '江浙沪', '珠三角', '港澳台'],
      data2: ['安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北', '河南', '湖北', '湖南', '江苏', '江西', '吉林', '辽宁', '宁夏', '青海', '山东', '山西', '陕西', '云南', '四川', '西藏', '新疆', '浙江', '澳门', '香港', '台湾', '内蒙古', '黑龙江'],
      data1: ['长沙', '长春', '成都', '重庆', '大连', '东莞', '福州', '中山', '贵阳', '合肥', '郑州', '济南', '昆明', '宁波', '南昌', '武汉', '南京', '青岛', '泉州', '沈阳', '苏州', '天津', '温州', '无锡', '西安', '厦门', '石家庄', '哈尔滨'],
      showSelect: false,
    };
  },
  methods: {
    show() {
      this.showSelect = !this.showSelect;
    },
    chooseCity(name) {
      this.$emit('showParentCity', name);
      // this.city = name;
      this.showSelect = false;
    },
  },
};
</script>

<style scoped>
  .areaselect {
    position: relative;
  }
  .selectarea {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    border: 1px solid #e9eaec;
    border-radius: 3px;
    background: #fff;
    font-size: 12px;
    vertical-align: middle;
    cursor: pointer;
  }
  .boxcontent {
    padding: 15px 15px;
    border: 1px solid #eee;

  }
  .list-inline {
    border-bottom: 1px dashed #eee;
    padding: 5px 5px;
  }
  .list-inline li {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
  }
  .list-inline li:hover {
    color: #f00;
  }
  .block-area {
    width: 300px;
    position: absolute;
    background-color: #fff;
    z-index: 99;
    left: 0;
    bottom: 100%;
  }
</style>
