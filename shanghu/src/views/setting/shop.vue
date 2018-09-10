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
            店铺列表
          </p>
          <Button class="margin-top-10" @click="addGroup" type="primary" icon="plus">添加店铺</Button>
          <!-- <Button class="margin-top-10" @click="addGroup" type="primary" icon="plus">添加店铺</Button> -->
          <Modal
              v-model="showAddNewGroup"
              title="修改店铺"
              @on-ok="update"
              @on-cancel="cancelAdd">

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
import { shopList } from '@/server/api';

export default {
  name: 'shop',
  components: {
    // tvmgroupsTvm,
  },
  data() {
    return {

      showAddNewGroup: false,
      tvmGroupName: '',
      columns: [
        {
          key: 'shop_name',
          title: '店铺名称',
          width: 100,
        },
        {
          key: 'master_wang',
          title: '旺旺名称',
          width: 120,
        },
        {
          key: 'shop_url',
          title: '店铺地址',
          width: 120,
          render: (h, params) => h('a', { attrs: { target: '_blank', href: `${params.row.shop_homeurl}` } }, '查看店铺地址'),
        },
        {
          key: 'send_name',
          title: '发件人姓名',
          // render: (h, params) => h('div', this.getTvmBygroup(params.row).then()),
          // render: (h, params) => h('tvmgroupsTvm', { props: {
          //   groupid: params.row.id,
          // } }),
        },
        {
          key: 'send_phone',
          title: '发件电话',
        },
        {
          key: 'send_address',
          title: '发件地址',
        },
        {
          key: 'shop_status',
          title: '审核状态',
          render: (h, params) => h('div', this.getstatus(params.row)),
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
                  // const argu = { id: params.row.id };
                  this.update(params.row.id);
                },
              },
            }, '修改'),
          ]),
        },
      ],
      data: [
      ],
    };
  },
  created() {
    this.getshoplist();
  },
  methods: {
    getshoplist() {
      shopList().then(res => {
        if (res.code === 0) {
          this.data = res.data;
          console.log(this.data);
        }
      });
    },
    // 修改票种类型的显示形式
    formatTickeInfo(data) {
      if (data && data.ticketsort) {
        return `${data.ticketsort.name}-${data.ticketsort.size}cm-${data.ticketsort.price}元`;
      }
      return '-';
    },

    tvmGroupList() {

    },
    addGroup() {
      // this.showAddNewGroup = true;
      this.$router.push({ name: 'bindshop' });
    },
    cancelAdd() {
      this.showAddNewGroup = false;
    },
    getstatus(row) {
      if (row.shop_status === 0) {
        return '未审核';
      } else {
        return '已通过';
      }
    },
    update(shopid) {
      console.log(shopid);
    },
  },
};
</script>

<style scoped>

</style>
