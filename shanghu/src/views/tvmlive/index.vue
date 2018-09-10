<style lang="less">
@import './tvmlive.less';
@import '../../styles/common.less';
</style>
<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col>
        <Row :gutter="10">
          <Col :md="4" :style="{marginBottom: '10px'}">
            <infor-card
                id-name="user_created_count"
                :end-val="count.total"
                iconType="android-person-add"
                color="#2d8cf0"
                intro-text="单元机总量"
            ></infor-card>
          </Col>
          <Col :md="4" :style="{marginBottom: '10px'}">
              <infor-card
                  id-name="visit_count"
                  :end-val="count.workingNum"
                  iconType="ios-eye"
                  color="#64d572"
                  :iconSize="50"
                  intro-text="工作中"
              ></infor-card>
          </Col>
          <Col :md="4" :style="{marginBottom: '10px'}">
              <infor-card
                  id-name="collection_count"
                  :end-val="count.pendingNum"
                  iconType="upload"
                  color="#ffd572"
                  intro-text="待填票"
              ></infor-card>
          </Col>
          <Col :md="4" :style="{marginBottom: '10px'}">
              <infor-card
                  id-name="transfer_count"
                  :end-val="count.waitingNum"
                  iconType="shuffle"
                  color="#f25e43"
                  intro-text="请填票"
              ></infor-card>
          </Col>
          <Col :md="4" :style="{marginBottom: '10px'}">
              <infor-card
                  id-name="error_count"
                  :end-val="count.errorNum"
                  iconType="shuffle"
                  color="#586071"
                  intro-text="故障中"
              ></infor-card>
          </Col>
          <!-- <Col :md="4" :style="{marginBottom: '10px'}">
              <infor-card
                  id-name="transfer_count"
                  :end-val="count.transfer"
                  iconType="shuffle"
                  color="#f25e43"
                  intro-text="今日服务调用量"
              ></infor-card>
          </Col> -->
        </Row>
      </Col>
    </Row>
    <Row :gutter="10">
      <Col v-for="item in tvmGroup" :key="item.id" span="6">
        <Card class="margin-top-10">
          <p slot="title">
            <Icon type="mouse"></Icon>
            {{item.groupname}}
          </p>
          <tvm-block class="margin-b--10" :item="item"></tvm-block>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import _ from 'lodash';
import { selectTvm, selectTvmGroup } from '@/server/api';
import tvmBlock from './components/tvmBlock';
import inforCard from './components/inforCard';

export default {
  name: 'tvmlive_index',
  components: {
    tvmBlock,
    inforCard,
  },
  data() {
    return {
      inntervalMethod: null,
      tvmGroup: [],
      count: {
        total: 0,
        workingNum: 0,
        waitingNum: 0,
        pendingNum: 0,
        errorNum: 0,
      },
    };
  },
  mounted() {
    this.getDataNow();
    // this.inntervalMethod = setInterval(() => {
    //   this.getDataNow();
    // }, 5000);
  },
  computed: {
    avatorPath() {
      return localStorage.avatorImgPath;
    },
  },
  beforeDestroy() {

  },
  destroyed() {
    // if (this.inntervalMethod) {
    //   clearInterval(this.inntervalMethod);
    // }
  },
  methods: {
    getDataNow() {
      selectTvmGroup().then(res => {
        this.tvmGroup = res.data;
      });
      selectTvm().then(res => {
        if (res.code === 0) {
          const data = res.data;
          this.count.total = data.length;
          this.count.workingNum = _.filter(data, d => d.status === 0 && d.ticketleft > 20).length;
          this.count.waitingNum = _.filter(data, d => d.status === 0 && d.ticketleft === 0).length;
          this.count.pendingNum = _.filter(data, d => d.status === 0 && d.ticketleft <= 20 && d.ticketleft > 0).length;
          this.count.errorNum = _.filter(data, d => d.status === 1).length;
        } else {
          this.$Message.error('获取失败!');
        }
      });
    },
  },
};
</script>
