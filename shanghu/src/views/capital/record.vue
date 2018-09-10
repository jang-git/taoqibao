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
            资金记录
          </p>
          <Row>
            <Input placeholder="请输入业务编号..." style="width: 200px" />
            <span style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            <Button type="ghost" >取消</Button>
          </Row>
          <Row class="margin-top-10">
            <Table :columns="columns" :data="data"></Table>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { selectTvm, addTvm } from '@/server/api';

export default {
  name: 'machines',
  data() {
    return {
      showAddNewGroup: false,
      tvmGroupName: '',
      columns: [
        {
          key: 'id',
          title: '时间',
          width: 100,
        },
        {
          key: 'tvmname',
          title: '收入',
        },
        {
          key: 'groupname',
          title: '支出',
          render: (h, params) => h('div', this.fromatGroup(params.row)),
        },
        {
          key: 'ticketsort',
          title: '结余',
          render: (h, params) => h('div', this.formatTickeInfo(params.row)),
        },
        {
          key: 'status',
          title: '备注',
          render: (h, params) => h('div', this.formatTicketNum(params.row)),
        },
        {
          key: 'workingstatus',
          title: '业务编号',
          render: (h, params) => h('div', this.formatWorkstatus(params.row)),
        },
        {
          key: 'action',
          title: '设置',
          width: 150,
          align: 'center',
          render: (h, params) => h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  const argu = { id: params.row.id };
                  this.$router.push({
                    name: 'tvminfo',
                    params: argu,
                  });
                },
              },
            }, '管理单元机'),
          ]),
        },
      ],
      data: [
        // {
        //   id: '0001',
        //   groupname: '吉林0001',
        //   ticketsort: '大吉大利 - 10cm - 10元',
        //   status: '100/200  工作中',
        //   workingstatus: '运行中',
        // },
      ],
    };
  },
  created() {
    this.tvmList();
  },
  methods: {
    formatTickeInfo(data) {
      if (data && data.ticketsort) {
        return `${data.ticketsort.name}-${data.ticketsort.size}cm-${data.ticketsort.price}元`;
      }
      return '-';
    },
    fromatGroup(data) {
      if (data && data.tvmgroup) {
        return `${data.tvmgroup.groupname}`;
      }
      return '-';
    },
    formatTicketNum(data) {
      return `${data.ticketleft}/ ${data.ticketnum}`;
    },
    formatWorkstatus(data) {
      const status = ['正常运行', '人工维护'];
      return status[data.status];
    },
    tvmList() {
      selectTvm().then(res => {
        this.data = res.data;
      });
    },
    addGroup() {
      this.showAddNewGroup = true;
    },

    cancelAdd() {
      this.showAddNewGroup = false;
    },
    addNew() {
      const data = {
        tvmname: this.tvmGroupName,
      };
      if (this.tvmGroupName === '') {
        this.$Message.error('请输入名称');
        return;
      }
      addTvm(data).then(res => {
        if (res.code === 0) {
          this.showAddNewGroup = false;
          this.$Message.success('添加成功!');
          this.tvmGroupName = '';
          this.tvmList();
        } else {
          this.$Message.error('添加失败!');
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
