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
            阵列组列表
          </p>
          <Row>
            <Input placeholder="请输入姓名搜搜..." style="width: 200px" />
            <span style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            <Button type="ghost" >取消</Button>
          </Row>
          <Button class="margin-top-10" @click="addGroup" type="primary" icon="plus">添加阵列组</Button>
          <Modal
              v-model="showAddNewGroup"
              title="添加阵列组"
              @on-ok="addNew"
              @on-cancel="cancelAdd">
              <Row type="flex" justify="center">
                  <Input v-model="tvmGroupName" icon="compose" placeholder="请输入阵列组名称" style="width: 300px" />
              </Row>
              <Row slot="footer">
                  <Button type="text" @click="cancelAdd">取消</Button>
                  <Button type="primary" @click="addNew">确定</Button>
              </Row>
          </Modal>
          <Row class="margin-top-10">
            <Table :columns="columns" :data="data"></Table>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { selectTvmGroup, addTvmGroup, currentTvmName } from '@/server/api';

export default {
  name: 'machines',
  components: {
    // tvmgroupsTvm,
  },
  data() {
    return {
      showAddNewGroup: false,
      tvmGroupName: '',
      columns: [
        {
          key: 'id',
          title: '阵列组ID',
          width: 100,
        },
        {
          key: 'groupname',
          title: '阵列组名称',
          width: 120,
        },
        {
          key: 'ticketsortabc',
          title: '票种规格',
          render: (h, params) => h('div', this.formatTickeInfo(params.row)),
        },
        {
          key: 'tvmname',
          title: '所属单元机',
          // render: (h, params) => h('div', this.getTvmBygroup(params.row).then()),
          render: (h, params) => h('tvmgroupsTvm', { props: {
            groupid: params.row.id,

          } }),
        },
        {
          key: 'action',
          title: '管理',
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
                    name: 'tvmgroupinfo',
                    params: argu,
                  });
                },
              },
            }, '管理阵列组'),
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
    this.tvmGroupList();
  },
  methods: {
    // 修改票种类型的显示形式
    formatTickeInfo(data) {
      if (data && data.ticketsort) {
        return `${data.ticketsort.name}-${data.ticketsort.size}cm-${data.ticketsort.price}元`;
      }
      return '-';
    },
    getTvmBygroup(data) {
      const tvmgroup = data.id;
      const dat = {
        id: tvmgroup,
      };
      // return data.id;
      const info = [];
      currentTvmName(dat).then(res => {
        if (res.code === 0) {
          for (let i = 0; i < res.data.length; i += 1) {
            info.push(res.data.tvmname);
          }
          return 'infaaao';
        } else {
          return '123';
        }
      });
      return 'bbb';
    },
    tvmGroupList() {
      selectTvmGroup().then(res => {
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
        groupname: this.tvmGroupName,
      };
      if (this.tvmGroupName === '') {
        this.$Message.error('请输入名称');
        return;
      }
      addTvmGroup(data).then(res => {
        if (res.code === 0) {
          this.showAddNewGroup = false;
          this.$Message.success('添加成功!');
          this.tvmGroupName = '';
          this.tvmGroupList();
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
