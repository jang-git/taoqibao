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
            刮奖日志
          </p>
          <Button @click="refresh()" type="ghost" >刷新数据</Button>
          <a id="hrefToExportTable"></a>
          <Button type="primary" @click="exportAllData()">导出当前数据(Excel)</Button>
          <div class="margin-top-10">
            <!-- <Select style="width:100px" v-model="search_tvm" placeholder="请选择单元机">
              <Option :value="''" v-if="search_status ==='' ">全部</Option>
              <Option :value="'1'">成功</Option>
              <Option :value="'2'">失败</Option>
            </Select> -->
            <Select style="width:200px;" v-model="search_tvm" placeholder="请选择单元机">
                <Option v-for="item in tvmlist" :value="item.tvmid" :key="item.id">
                  {{ item.tvmname }}</Option>
              </Select>


            <Select style="width:100px" v-model="search_status" placeholder="请选择状态">
              <!-- <Option :value="''" v-if="search_status ==='' ">全部</Option> -->
              <Option :value="'1'">成功</Option>
              <Option :value="'2'">失败</Option>
            </Select>
            <DatePicker type="datetimerange" v-model="dateArea" @on-clear="clearTime()" @on-change="timeCommit()" placeholder="选择时间段" style="width: 300px"></DatePicker>
            <!-- <Input placeholder="请输入姓名搜搜..." style="width: 200px" /> -->
            <span style="margin: 0 10px;"><Button @click="search()" type="primary" icon="search">搜索</Button></span>
            <!-- <Button type="ghost" >取消</Button> -->
          </div>
          <Row class="margin-top-10">
            <Table :loading="loading" :columns="columns" :data="data" ref="table"></Table>
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
import moment from 'moment';
import table2excel from '@/libs/table2excel';
import { drawticketLog, selectTvm } from '@/server/api';

export default {
  name: 'machines',
  data() {
    return {
      search_tvm: '',
      tvmlist: [],
      dateArea: [],
      search_startTime: '',
      search_endTime: '',
      search_status: '0',
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
          fixed: 'left',
        },
        {
          key: 'tvmname',
          title: '单元机名称',
          width: 120,
          render: (h, params) => h('div', params.row.tvm && params.row.tvm.tvmname),
        },
        {
          key: 'ticketid',
          title: '订单号',
          width: 280,
        },
        {
          key: 'errcode',
          title: '状态码',
          width: 80,
        },
        {
          key: 'errmsg',
          title: '状态说明',
          width: 200,
        },
        {
          key: 'ticketbarcode',
          title: '彩票二维码唯一标识',
          width: 280,
        },
        {
          key: 'ticketsecurecode',
          title: '彩票保安区条码',
          width: 280,
        },
        {
          key: 'isvalid',
          title: '是否中奖',
          width: 150,
          render: (h, params) => h('div', this.formatWorkstatus(params.row)),
        },
        {
          key: 'bonus',
          title: '中奖金额',
          width: 100,
        },
        {
          key: 'createtime',
          title: '日志报告时间',
          width: 150,
        },
        {
          key: 'picurl1',
          title: '刮开前图像',
          width: 100,
          fixed: 'right',
          render: (h, params) => h('a', { attrs: { target: '_blank', href: `http://${params.row.picurl1}` }, class: ['avatarnew'] }, [
            h('img', {
              attrs: {
                src: `http://${params.row.picurl1}`,
              },
              class: ['ticket-pic'],
            }),
          ]),
        },
        {
          key: 'picurl2',
          title: '刮开后图像',
          width: 100,
          fixed: 'right',
          render: (h, params) => h('a', { attrs: { target: '_blank', href: `http://${params.row.picurl2}` }, class: ['avatarnew'] }, [
            h('img', {
              attrs: {
                src: `http://${params.row.picurl2}`,
              },
              class: ['ticket-pic'],
            }),
          ]),
        },

      ],
      data: [],
    };
  },
  created() {
    this.drawTikcetLogs(1);
    this.tvmList();
  },
  methods: {
    // 导出所有的数据
    exportAllData() {
      // const dataFilter = [];
      // for (let i = 0; i < this.data.length; i += 1) {
      //   const c = this.data[i];
      //   c.tvmname = this.data[i].tvm && this.data[i].tvmname;
      //   dataFilter.push(c);
      // }
      // this.$refs.table.exportCsv({
      //   filename: '日志数据',
      //   data: dataFilter,
      // });

      table2excel.transform(this.$refs.table, 'hrefToExportTable', '日志数据');
    },
    rowClassName(row) {
      if (row.errcode !== '0') {
        return 'error-row';
      }
      return '';
    },
    clearTime() {
      this.dateArea = [];
      this.search_startTime = '';
      this.search_endTime = '';
    },
    search() {
      this.drawTikcetLogs(0);
    },
    changePage(e) {
      this.loading = true;
      this.drawTikcetLogs(e);
    },
    formatWorkstatus(data) {
      const status = ['未中奖', '已中奖'];
      return status[data.isvalid];
    },
    // 单元机列表
    tvmList() {
      selectTvm().then(res => {
        this.tvmlist = res.data;
      });
    },
    refresh() {
      this.search_tvm = '';
      this.search_status = '';
      this.search_startTime = '';
      this.search_endTime = '';
      this.page = 1;
      this.dateArea = [];
      this.drawTikcetLogs(1);
    },
    timeCommit() {
      if (this.dateArea.length > 1) {
        this.search_startTime = moment(this.dateArea[0]).format('YYYY-MM-DD HH:mm:ss');
        this.search_endTime = moment(this.dateArea[1]).format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.search_startTime = '';
        this.search_endTime = '';
      }
    },
    drawTikcetLogs(num) {
      this.loading = true;
      const data = {
        tvmid: this.search_tvm,
        page: num,
        errcode: this.search_status,
        startTime: this.search_startTime.toString(),
        endTime: this.search_endTime.toString(),
        orderNumber: '',
      };
      console.log(data);
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

<style>
  .ivu-table-row.error-row td{
    background-color: rgb(242, 94, 67);
    color: #fff;
  }
  .avatarnew{
    width: 100px;
  }
  .pic {
    width: 100px;
    height: auto;
  }
</style>
