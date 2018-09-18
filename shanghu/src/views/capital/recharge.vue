<style lang="less">
  @import '../../styles/common.less';
</style>
<template>
  <div>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            账号充值
          </p>
          <div>
            这里是转账信息说明，包括银行卡信息
          </div>
          <Button type="primary" size="large" @click="showForm">提交转账信息</Button>
          <Modal
              v-model="formModal"
              :loading="loading"
              title="提交转账信息"
              @on-ok="addNew"
              @on-cancel="cancelAdd" >
                <Form :model="formData" ref="formCustom" :label-width="120">
                  <FormItem label="转账银行名称">
                    <Select v-model="formData.bankname">
                      <Option :value="item" v-for="(item,index) in bankList" :key="index">
                        {{item}}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="转出银行卡号">
                    <Input v-model="formData.cardnumber" placeholder="请输入汇款者银行卡号"></Input>
                  </FormItem>
                  <FormItem label="转出银行卡姓名">
                    <Input v-model="formData.accountname" placeholder="请输入汇款者姓名"></Input>
                  </FormItem>
                  <FormItem label="转账金额">
                    <InputNumber style="width:100px;" :max="1000000" :min="1" v-model="formData.money"></InputNumber>
                    <!-- <Input v-model="formData.money" number placeholder="汇款金额"></Input> -->
                  </FormItem>
                </Form>
          </Modal>
          <!-- <Row>
            <Input placeholder="请输入业务编号..." style="width: 200px" />
            <span style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
            <Button type="ghost" >取消</Button>
          </Row> -->
          <div class="margin-top-10">
            <Table :columns="columns" :data="data"></Table>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { addCharge, chargeList } from '@/server/api';
import config from '../../libs/siteconfig';
import utils from '../../libs/util';

export default {
  name: 'machines',
  data() {
    return {
      loading: true,
      formModal: false,
      bankList: config.banklist,
      formData: {
        bankname: '',
        cardnumber: '',
        accountname: '',
        money: null,
      },
      columns: [
        {
          key: 'id',
          title: '提交时间',
          render: (h, params) => h('div', this.timedatea(params.row)),
        },
        {
          key: 'bankname',
          title: '转账银行',
        },
        {
          key: 'accountname',
          title: '开户名',
        },
        {
          key: 'money',
          title: '金额',
        },
        {
          key: 'status',
          title: '审核状态',
          render: (h, params) => h('div', this.status(params.row)),
        },
        {
          key: 'updatetime',
          title: '审核时间',
          render: (h, params) => h('div', this.timedate(params.row)),
        },
      ],
      data: [],
    };
  },
  created() {
    this.list();
  },
  mounted() {

  },
  methods: {
    showForm() {
      this.formModal = true;
    },
    status(row) {
      if (row.num === 0) {
        return '待审核';
      } else if (row.num === 1) {
        return '审核通过';
      } else {
        return '未通过';
      }
    },
    timedatea(row) {
      if (row.createtime === 0) {
        return '-';
      } else {
        return utils.timetoDate(row.createtime);
      }
    },
    timedate(row) {
      if (row.updatetime === 0) {
        return '-';
      } else {
        return utils.timetoDate(row.updatetime);
      }
    },
    cancelAdd() {
      this.formModal = false;
    },
    list() {
      chargeList().then(res => {
        if (res.code === 0) {
          this.data = res.data;
        }
      });
    },
    addNew() {
      const data = this.formData;
      addCharge(data).then(res => {
        if (res.code === 0) {
          this.cancelAdd();
          this.$refs.formCustom.resetFields();
          this.$Message.success(res.msg);
          this.list();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
