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
            正式订单列表
          </p>
          <Button @click="refresh()" type="ghost" >刷新数据</Button>
          <!-- <Row>
            <Input placeholder="请输入姓名搜搜..." style="width: 200px" />
            <span style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            <Button type="ghost" >取消</Button>
          </Row> -->
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
import { orderList } from '@/server/api';
import { lotteryStatus, orderStatus } from '@/libs/order';
import util from '../../libs/util';

export default {
  name: 'order_index',
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
          key: 'order_num',
          title: '订单号',
          width: 250,
        },
        {
          key: 'uid',
          title: '用户ID',
        },
        {
          key: 'status',
          title: '支付状态',
          render: (h, params) => h('div', this.orderFormat(params.row.status)),
        },
        {
          key: 'lottery_status',
          title: '彩票开奖状态',
          render: (h, params) => h('div', this.ticketFromat(params.row.lottery_status)),
        },

        {
          key: 'lottery_money',
          title: '中奖金额',
          render: (h, params) => h('div', `${params.row.lottery_money} 元`),
        },
        {
          key: 'original_img',
          title: '刮奖前截图',
          render: (h, params) => {
            if (params.row.original_img) {
              return h('a', { attrs: { target: '_blank', href: `http://${params.row.original_img}` }, class: ['avatarnew'] }, [
                h('img', {
                  attrs: {
                    src: `http://${params.row.original_img}`,
                  },
                  class: ['ticket-pic'],
                }),
              ]);
            } else {
              return h('div', '暂无图片');
            }
          },
        },
        {
          key: 'lottery_img',
          title: '刮奖后截图',
          render: (h, params) => {
            if (params.row.lottery_img) {
              return h('a', { attrs: { target: '_blank', href: `http://${params.row.lottery_img}` }, class: ['avatarnew'] }, [
                h('img', {
                  attrs: {
                    src: `http://${params.row.lottery_img}`,
                  },
                  class: ['ticket-pic'],
                }),
              ]);
            } else {
              return h('div', '暂无图片');
            }
          },
        },
        {
          key: 'lid',
          title: '彩票类型',
          render: (h, params) => h('div', this.formatTicket(Number(params.row.lid))),
        },
        {
          key: 'lottery_number',
          title: '彩票序号',
        },
        {
          key: 'lottery_time',
          title: '开奖时间',
          render: (h, params) => h('div', this.formatTime(Number(params.row.lottery_time))),
        },
        {
          key: 'created_at',
          title: '下单时间',
          render: (h, params) => h('div', this.formatTime(Number(params.row.created_at))),
        },
      ],
      data: [],
    };
  },
  created() {
    this.testTask(1);
  },
  methods: {
    formatTime(data) {
      if (data > 0) {
        return util.timetoDate(data);
      }
      return '-';
    },
    // 彩票类型
    formatTicket(id) {
      const data = ['', '5倍惊喜', '发奖金', '金钥匙', '马上有奖', '一刮千金', '好运十倍'];
      return data[id];
    },
    changePage(e) {
      this.testTask(e);
      console.log(e);
    },
    orderFormat(status) {
      return orderStatus[status];
    },
    ticketFromat(status) {
      return lotteryStatus[status];
    },
    refresh() {
      this.loading = true;
      this.testTask();
    },
    testTask(num) {
      const data = {
        page: num,
      };
      orderList(data).then(res => {
        if (res && res.code === 0) {
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
  .avatarnew{
    width: 100px;
  }
  .pic {
    width: 100px;
    height: auto;
  }
</style>
