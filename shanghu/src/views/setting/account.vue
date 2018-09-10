<style lang="less">
  @import '../../styles/common.less';
</style>
<template>
  <div>
    <Row :gutter="10">
      <Col span="12">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            登录设置
          </p>
          <Form
            :model="account"
            :label-width="100">
            <FormItem label="原密码">
              <Input
                v-model="account.oldpass"
                type="password"
                placeholder="原密码"></Input>
            </FormItem>
            <FormItem label="新密码">
              <Input
                type="password"
                v-model="account.newpass"
                placeholder="新密码"></Input>
            </FormItem>
            <FormItem label="确认密码">
              <Input
              type="password"
                v-model="account.newpass"
                placeholder="">
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary">确定修改</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            银行卡设置
          </p>
          <Form
            :model="account"
            :label-width="100">
            <FormItem label="开户姓名">
              <Input
                v-model="account.oldpass"
                type="password"
                placeholder="原密码"></Input>
            </FormItem>
            <FormItem label="开户行">
              <Input
                type="password"
                v-model="account.newpass"
                placeholder=""></Input>
            </FormItem>
            <FormItem label="支行名称">
              <Input
                type="password"
                v-model="account.newpass"
                placeholder="支行名称"></Input>
            </FormItem>
            <FormItem label="银行卡号">
              <Input
                v-model="account.newpass"
                placeholder="">
              </Input>
            </FormItem>
            <FormItem label="确认卡号">
              <Input
                v-model="account.newpass"
                placeholder="">
              </Input>
            </FormItem>
            <FormItem label="手机号码">
              <Input
                v-model="account.newpass"
                placeholder="">
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary">确定</Button>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="modalTicketSort"
      :mask-closable="false"
      title="添加票种"
      @on-ok="okAddTikcetSort">
      <Form
        :model="formTicket"
        :label-width="100">
        <FormItem label="票种名称">
          <Input
            v-model="formTicket.name"
            placeholder="请输入票种名称"></Input>
        </FormItem>
        <FormItem label="票种尺寸">
          <Input
            v-model="formTicket.size"
            placeholder="请输入票种尺寸"></Input>
        </FormItem>
        <FormItem label="票种面值">
          <Input
            v-model="formTicket.price"
            placeholder="">
          </Input>
        </FormItem>

      </Form>
    </Modal>
  </div>
</template>

<script>
import { ticketSortList, addTicketSort } from '@/server/api';

export default {
  name: 'machines',
  data() {
    return {
      account: {
        oldpass: '',
        newpass: '',
      },
      modalTicketSort: false,
      formTicket: {
        name: '',
        size: '',
        price: '',
      },
    };
  },
  created() {
    this.ticketList();
  },
  methods: {
    createTicket() {
      this.modalTicketSort = true;
    },
    okAddTikcetSort() {
      const data = this.formTicket;
      addTicketSort(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('添加成功!');
          this.formTicket = {
            name: '',
            size: '',
            price: '',
          };
          this.ticketList();
        }
      });
    },

    ticketList() {
      ticketSortList().then(res => {
        if (res.code === 0) {
          this.data = res.data;
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
