<style lang="less">
  @import '../../styles/common.less';
</style>
<template>
  <div>

    <!-- <Button class="margin-top-10" @click="addMask" type="primary" icon="plus">发布测试任务</Button> -->
    <Row>
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            单元机测试区域
          </p>
          <Input v-model="testTasknum" placeholder="请输入测试任务数量" style="width: 200px" />
          <Poptip
            confirm
            title="确定此操作吗?"
            @on-ok="addMask"
            >
            <Button type="primary" icon="plus" :disabled="tvmData.status===0 ">发布测试任务</Button>
          </Poptip>
        </Card>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            单元机状态汇总
          </p>
          <Row class="padding-tb-10">
            <Col span="12">单元机ID: {{tvmData.id}}</Col>
            <Col span="12">所属阵列组:
            <span v-if="tvmData.tvmgroup">
              {{tvmData.tvmgroup.groupname}}
            </span>
            <span v-else>待分配</span>
              </Col>
          </Row>
          <Row class="padding-tb-10">
            <Col span="12">物理码信息: {{tvmData.tvmid}}</Col>
            <Col span="12">票种规格: <span v-if="tvmData.ticketsort">
              {{tvmData.ticketsort.name}} - {{tvmData.ticketsort.size}}cm -{{tvmData.ticketsort.price}}元
              </span>
              <span v-else>待分配</span></Col>
          </Row>
          <Row class="padding-tb-10">
            <Col span="12">票量状态: {{tvmData.ticketleft}} / {{tvmData.ticketnum}}</Col>
            <Col span="12">维护状态: {{tvmData.status}}</Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Col span="12">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            票量状态
          </p>
          <Form inline>
            <FormItem label="票种规格管理" :label-width="100" label-position="left">
              <Select style="width:250px;" v-model="selectedTicketSort" placeholder="请选择票种">
                <Option v-for="item in ticketSortList" :value="item.id" :key="item.id">
                  {{ item.name }} - {{item.size}}cm - {{item.price}}元</Option>
              </Select>
            </FormItem>
            <Poptip
              confirm
              title="确定此操作吗?"
              @on-ok="setTicketToTvm"
              >
              <Button type="primary">确定</Button>
            </Poptip>
          </Form>
          <Form ref="formInline" :model="formInline">
            <FormItem label="上票管理" :label-width="100" label-position="left">
              <RadioGroup v-model="radioTicknum">
                <Radio label="200">200张</Radio>
                <Radio label="300">300张</Radio>
                <Radio label="400">400张</Radio>
                <Radio label="500">500张</Radio>
                <Radio label="其他"></Radio>
                <Input v-model="otherNum" v-show="radioTicknum === '其他'" style="width:120px" size="small" placeholder="请输入数量"/>
              </RadioGroup>
              <Poptip
                confirm
                title="确定此操作吗?"
                @on-ok="setTicketNum"
                >
                <Button type="primary">确认上票</Button>
              </Poptip>
            </FormItem>
          </Form>
          <Table :columns="columns1" :data="logsTicket"></Table>
        </Card>
      </Col>
      <Col span="12" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            设置维护状态
          </p>
          <div class="tvm-status-content">
            <Row>
              <Col class="normal" span="24">
                <div class="status-block" @click="toggleStatus(0)" :class="{'active': tvmStatus === 0}" >正常运行中</div>
              </Col>
            </Row>
            <Row :gutter="20" class="margin-top-10 error">
              <Col span="8"><div @click="toggleStatus(1)" class="status-block" :class="{'active': tvmStatus === 1}" >人工维护</div></Col>
              <!-- <Col span="8"><div class="status-block">故障维护 - 拍照异常</div></Col>
              <Col span="8"><div class="status-block">故障维护 - 兑奖异常</div></Col> -->
            </Row>
          </div>
          <Table class="margin-top-10" :columns="columns1" :data="logsStatus"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { tvmInfo, addTestTask, setTvmStatus, ticketSortList, tvmLogList, setTvmTicketNum, setTvmTicketSort } from '@/server/api';

export default {
  data() {
    return {
      testTasknum: 1,
      radioTicknum: '', // radio 的选中值
      otherNum: '', // 其他数量
      tvmData: {},
      id: 0,
      tvmStatus: null,
      ticketSortList: [], // 票种规格列表
      logsTicket: [], // 上票日志
      logsStatus: [], // 机器状态日志
      selectedTicketSort: '',
      columns1: [
        {
          title: '日志时间',
          key: 'createtime',
        },
        {
          title: '事件',
          key: 'info',
        },
      ],
      formInline: {
        user: '',
        password: '',
      },
      ruleInline: {
        user: [
          { required: true, message: 'Please fill in the user name', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'Please fill in the password.', trigger: 'blur' },
          { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.id = parseInt(this.$route.params.id, 10);
    this.getTvmInfo();
    this.getTicketSort();
    this.getTicketLog();
    this.getStatusLog();
  },
  mounted() {
    // this.logsTicket = [1, 2];
    // this.logsStatus = this.getTvmLog(2);
  },
  methods: {
    // 切换状态
    toggleStatus(sta) {
      if (sta === this.tvmStatus) return;
      this.$Modal.confirm({
        title: '友情提示',
        content: '确定要此操作吗？',
        loading: true,
        onOk: () => {
          const datas = {
            id: this.id,
            status: sta,
          };
          setTvmStatus(datas).then(res => {
            if (res.code === 0) {
              this.tvmStatus = sta;
              this.tvmData.status = sta;
              this.$Message.success('设置成功!');
            } else {
              this.$Message.error('设置失败');
            }
          });
          this.$Modal.remove();
        },
      });
    },
    // 发布测试任务
    addMask() {
      const data = {
        tvmid: this.tvmData.tvmid,
        num: this.testTasknum,
      };
      addTestTask(data).then(res => {
        if (res.code === 0) {
          this.$Notice.open({
            title: '测试任务',
            desc: res.msg,
          });
          // this.$Message.success(res.msg);
        }
      });
    },
    // 获取票种列表
    getTicketSort() {
      ticketSortList().then(res => {
        this.ticketSortList = res.data;
      });
    },
    // 设置单元机票种规格
    setTicketToTvm() {
      const datas = {
        id: this.id,
        ticketsortid: this.selectedTicketSort,
      };
      setTvmTicketSort(datas).then(res => {
        if (res.code === 0) {
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },

    // 设置票的数量
    setTicketNum() {
      let num = this.radioTicknum;
      if (this.radioTicknum === '其他') {
        num = this.otherNum;
      }
      const datas = {
        id: this.id,
        ticketnum: num,
      };
      setTvmTicketNum(datas).then(res => {
        if (res.code === 0) {
          this.$Message.success(res.msg);
          this.radioTicknum = null;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    // 获取上票日志
    getTicketLog() {
      const data = {
        tvmid: this.id,
        type: 1,
      };
      tvmLogList(data).then(res => {
        if (res.code === 0) {
          this.logsTicket = res.data;
        }
      });
    },
    // 获取状态日志
    getStatusLog() {
      const data = {
        tvmid: this.id,
        type: 2,
      };
      tvmLogList(data).then(res => {
        if (res.code === 0) {
          this.logsStatus = res.data;
        }
      });
    },
    // 获取单元机信息
    getTvmInfo() {
      const data = {
        id: this.id,
      };
      tvmInfo(data).then(res => {
        if (res.code === 0) {
          this.tvmData = res.data;
          this.tvmStatus = res.data.status;
          this.selectedTicketSort = res.data.ticketsortid;
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
  .status-block {
    width: 100%;
    display: block;
    border: 1px dashed #eee;
    padding: 10px 10px;
    text-align: center;
    cursor: pointer;
  }
  .normal .status-block.active {
    background-color: #00a854;
    color: #fff;
  }
  .error .status-block.active {
    background-color: rgb(242, 94, 67);
    color: #fff;
  }
</style>
