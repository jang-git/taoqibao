<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            任务列表
          </p>
          <div class="order-list" v-for="(item,index) in listdata" :key="index">
            <div class="ot f-cb">
              <div class="f-fl">
                <img class="plat-logo" src="http://s.zhuan.net/image/icon_1.png">
                <span class="shopname">{{item.shop.shop_name}}</span>
              </div>
              <div class="f-fr">
                <ul class="f-cb ">
                  <li class="f-fl prompt">
                  <span style="color:#D9B300">{{item.task_type.tasktype_name}}</span>
                  </li>
                  <li class="f-fl vgb"></li>
                  <li class="f-fl prompt">总单数：{{item.nums}}</li>
                  <li class="f-fl vgb"></li>
                  <li class="f-fl prompt">任务编号：{{item.id}}</li>
                  <li class="f-fl vgb"></li>
                  <li class="f-fl">
                    <a class="xq" href="">[查看详情]</a>
                    <a class="cf" href="">[重新发布]</a>
                  </li>
                  <li class="f-fl status p-r">
                    <span class="taking">{{item.status | formatStatus}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="ob f-cb">
              <div class="f-fl g-info p-r">
                <div class="f-cb">
                  <a href="#" target="_blank">
                    <img class="goods f-fl" :src="item.task_product.product_img" alt="商品主图">
                  </a>
                  <div class="f-fl ">
                    <div class="g-desc lim-w"> {{item.task_product.product_name}} </div>
                    <div class="r-time">{{item.createtime | formatDate}}</div>
                  </div>
                </div>
              </div>
              <div class="f-fr opt-c">
                <ul class="f-cb">
                  <li class="f-fl vbar">
                    <span class="count" href="#"><p class="num">0</p><p class="o-tag">未接单</p></span>
                  </li>
                  <li class="f-fl vbar">
                    <span class="count" href="#"><p class="num">0</p><p class="o-tag">待操作</p></span>
                  </li>
                  <li class="f-fl vbar">
                    <span class="count" style="color: #F00;" href="#">
                      <p class="num">0</p><p class="o-tag">待返款发货</p></span>
                  </li>
                  <li class="f-fl vbar">
                    <span class="count" href="#">
                      <p class="num">0</p><p class="o-tag">待评价</p>
                    </span></li>
                  <li class="f-fl vbar"><span class="count" href="#"><p class="num">0</p><p class="o-tag">待确认</p></span></li>
                  <li class="f-fl">
                    <span class="count" href="#">
                    <p class="num">0</p><p class="o-tag">已完成</p>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="page-content">
            <Page class="margin-top-10" :total="total" :current="currentPage" :page-size="pageSize" @on-change="changePage"/>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { taskList } from '@/server/api';
// import { tasktype } from './data';
import utils from '../../libs/util';

export default {
  name: 'tasklist',
  data() {
    return {

      total: 0,
      pageSize: 10,
      currentPage: 1,
      listdata: [],
    };
  },
  created() {
    this.getTaskList(1);
  },
  methods: {
    changePage(e) {
      this.getTaskList(e);
    },
    // 获取任务列表数据
    getTaskList(num) {
      const data = {
        page: num,
      };
      taskList(data).then(res => {
        if (res.code === 0) {
          this.listdata = res.data.data;
          this.total = res.data.count;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
        }
        console.log(res);
      });
    },
  },
  filters: {
    formatDate(timenum) {
      return utils.timetoDate(timenum);
    },
    formatStatus(status) {
      const taskStatus = ['', '待支付', '待审核', '任务进行中', '审核未通过', '已完成'];
      return taskStatus[status];
    },
  },
};
</script>

<style scoped>
li {
    list-style: none;
}
.f-cb, .f-cbli li {
    zoom: 1;
}
.page-content {
  padding: 20px 0;
}
.f-fl {
  float: left;
}
.f-fr {
  float: right;
}
.p-r {
    position: relative;
}
.ot .plat-logo {
  margin-right: 5px;
  position: relative;
  top: 2px;
}
.order-list {
  overflow: hidden;
}
.ot {
  padding: 20px 6px 6px 6px;
  overflow: hidden;
  border-bottom: 1px dashed #d8dadb;
}
.ot .status {
  margin-left: 20px;
}
.ot .vgb {
  width: 1px;
  height: 20px;
  background-color: #edeeef;
  margin-left: 10px;
  margin-right: 10px;
}
.ob {
  padding: 20px 8px 16px 8px;
}
.ob .goods {
  width: 80px;
  height: 80px;
  margin-right: 9px;
}
.ob .g-desc {
  width: 300px;
  height: 40px;
  white-space: normal;
}
.lim-w {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.ob .r-time {
  position: absolute;
  bottom: 0px;
  left: 90px;
  color: #9d9c9a;
}
.opt-c {
  margin-top: 16px;
}
.opt-c .vbar {
  border-right: 1px dashed #cfcecd;
}
.opt-c .count {
  display: block;
  padding: 9px 10px 7px 10px;
  color: #737272;
  text-align: center;
}
</style>
