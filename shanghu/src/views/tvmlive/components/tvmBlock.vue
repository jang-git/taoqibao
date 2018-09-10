<template>
  <div>
    <Row :gutter="20" class="tvm-block">
      <Col span="12" v-for="item in tvmList" :key="item.tvmid">
        <!-- <div class="tvm-block-item"> -->
          <router-link class="tvm-block-item" :to="{ name: 'tvminfo', params: { id: item.id }}">
          <div class="tvm-name">单元机: {{item.tvmname}}</div>
          <div class="data-block" :class="classStatus(item.ticketleft, item.status)">
            <div class="data-num">
              <div>剩余</div>
              <div class="num">{{item.ticketleft}}</div>
              <div>/{{item.ticketnum}}</div>
            </div>
          </div>
          </router-link>
        <!-- </div> -->
      </Col>

      <Col span="12" v-for="it in overplusNum" :key="it">
        <div class="tvm-block-item">
          <div class="tvm-name">单元机: 暂无</div>
          <div class="data-block empty">
            <div class="data-num">
              <div>空占位({{it}})</div>
            </div>
          </div>
        </div>
      </Col>

    </Row>
  </div>
</template>

<script>
import { currentTvmList } from '@/server/api';

export default {
  name: 'tvmBlock',
  props: ['item'],
  data() {
    return {
      tvmList: [],
      overplusNum: 0,
    };
  },
  mounted() {
    this.getGroupdata();
  },
  watch: {
    item() {
      this.getGroupdata();
    },
  },
  methods: {
    getGroupdata() {
      const data = {
        id: this.item.id,
      };
      currentTvmList(data).then(res => {
        if (res.code === 0) {
          this.tvmList = res.data;
          this.overplusNum = 4 - this.tvmList.length;
        }
      });
    },
    classStatus(num, status) {
      if (status !== 0) {
        return 'wrong';
      }
      if (num === 0) {
        return 'error';
      }
      if (num <= 20) {
        return 'await';
      }
      return 'normal';
    },
  },
};
</script>

<style scoped>

</style>
