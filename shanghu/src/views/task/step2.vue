<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card>
          <Steps :current="2">
            <Step title="第一步" content="选择任务类型"></Step>
            <Step title="第二步" content="填写任务信息"></Step>
            <Step title="第三步" content="支付"></Step>
            <Step title="第四步" content="发布成功"></Step>
          </Steps>
        </Card>
      </Col>
    </Row>
    <div class="step-block">
      <Row class="margin-top-10" :gutter="10">
        <Col span="24">
          <Card>
            <p slot="title">
              <Icon type="mouse"></Icon>
              本次任务费用详情
            </p>
            <table class="pay-detail">
              <tbody>
                <tr>
                <th width="15%">分类</th>
                <th width="40%">费用明细</th>
                <th width="15%">数量</th>
                <th width="30%">小计</th>
              </tr>

              <tr v-for="(item,key) in yongjin" :key="item.id" :class="key === 0 ? 'top-border' : ''">
                <td :rowspan="yongjin.length" v-if="key === 0">佣金</td>
                <td>
                  <div class="detail" style="text-align: left;padding-left: 55px;">
                    <p>{{chargeSort[item.pricetype]}} {{item.price}}金/单</p>
                  </div>
                </td>
                <td>{{item.num}}单</td>
                <td>{{item.total_amount}}金</td>
              </tr>
              <tr v-for="(item,key) in benjin" :key="item.id" :class="key === 0 ? 'top-border' : ''">
                <td :rowspan="benjin.length" v-if="key === 0">本金</td>
                <td>
                  <div class="detail" style="text-align: left;padding-left: 55px;">
                    <p>{{chargeSort[item.pricetype]}} {{item.price}} 元/单</p>
                  </div>
                </td>
                <td>{{item.num}}单</td>
                <td>{{item.total_amount}}元</td>
              </tr>

            </tbody>
            </table>

            <div class="pay-total">
              合计单数： <span class="striking">{{totalNum}}</span>单<br>
              合计支付： 本金<span class="money">{{bjPrice}}</span>元 +  佣金<span class="money">{{yjPrice}}</span>金
            </div>

            <div class="pay-method">
              <div class="f-fl">
                <input type="radio" checked="checked">
                <span>
                使用账户余额支付 （可用本金 <span class="money">0.00</span>元，
                余额不够<a class="striking">马上充值</a>)
                </span>
              </div>
            </div>
            <Button type="primary" @click="pay"> 付款并发布任务 </Button>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { userinfo, step2, payMent } from '@/server/api';

export default {
  name: 'step2',
  data() {
    return {
      balance: 0, // 用户余额
      chargeSort: ['', '基础佣金', '文字好评', '图文评价', '平台返款服务费', '返款本金'],
      totalNum: 0,
      yjPrice: 0,
      bjPrice: 0,
      task_charge: {
        num: 0, // 总单数
        total: 0, // 总价格
        yj: {
          name: '佣金',
          price: 0,
          data: [
          ],
        },
        bj: {
          name: '本金',
          price: 0,
          data: [
          ],
        },
      },
      yongjin: [],
      benjin: [],
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {

  },
  methods: {
    getUserinfo() {
      userinfo().then(res => {
        if (res.code === 0) {
          this.balance = res.data.balance;
        }
      });
    },
    fetchData() {
      const data = {
        taskid: Number(this.$route.params.taskid),
      };
      step2(data).then(res => {
        if (res.code === 0) {
          this.yongjin = res.data.yj;
          this.benjin = res.data.bj;
          this.bjPrice = _.sumBy(this.benjin, 'total_amount');
          this.yjPrice = _.sumBy(this.yongjin, 'total_amount');
          this.totalNum = res.data.total.nums;
        } else {
          this.$Message.error('数据错误');
        }
      });
    },
    pay() {
      const data = {
        taskid: this.$route.params.taskid,
      };
      payMent(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('支付成功!');
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  },
  watch: {
    $route: 'fetchData',
  },
};
</script>

<style scoped>
  .pay-detail {
    width: 100%;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
    background-color: transparent;
  }
  .pay-detail th, .pay-detail td {
    margin: 0 0;
    padding: 0 0;
  }
  .pay-detail th {
    background-color: #f5f6f6;
    border: 1px solid #ededee;
    text-align: center;
    line-height: 30px;
  }
  .pay-detail td {
    border: 1px solid #ededee;
    text-align: center;
  }
  .pay-detail .detail {
    padding-top: 16px;
    padding-bottom: 15px;
  }
  .pay-total {
    text-align: right;
  }
  .striking {
    color: #0098e1;
  }
  .money {
    color: #fd6703;
    font-weight: 800;
  }
  .top-border {
    border-top: 5px solid #ededee;
  }
  .pay-method {
    padding: 20px 0;
  }
</style>
