<style lang="less">
  @import '../../styles/common.less';
</style>
<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            刮奖失败日志
          </p>
          <Row class="margin-top-10">
            <Table :loading="loading" :columns="columns" :data="data"></Table>
            <Page
            class="margin-top-10"
            :total="total"
            :current="currentPage"
            :page-size="pageSize"
            @on-change="changePage"/>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { drawticketLog } from '@/server/api';

export default {
  name: 'machines',
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      loading: true,
      showAddNewGroup: false,
      tvmGroupName: '',
      columns: [
        {
          key: 'id',
          title: 'ID',
          width: 100,
        },
        {
          key: 'tvmid',
          title: '单元机ID',
        },
        {
          key: 'errcode',
          title: '错误编码',
        },
        {
          key: 'errmsg',
          title: '错误信息',
        },
      ],
      data: [],
    };
  },
  created() {
    this.logList(1);
  },
  methods: {
    changePage(e) {
      this.loading = true;
      this.logList(e);
    },
    formatWorkstatus(data) {
      const status = ['正常运行', '人工维护'];
      return status[data.status];
    },
    // 日志列表
    logList(num) {
      const data = {
        type: 2,
        page: num,
      };
      drawticketLog(data).then(res => {
        if (res.code === 0) {
          this.loading = false;
          this.data = res.data.data;
          this.total = res.data.count;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
