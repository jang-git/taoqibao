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
            阵列组状态汇总 ({{data.groupname}})
          </p>
          <Row class="padding-tb-10" :gutter="10">
            <Col span="8">阵列组ID: {{data.id}}</Col>
            <Col span="8">阵列组地域: {{data.addressname}}</Col>
            <Col span="8">票种规格: <span v-if="data.ticketsort">
              {{data.ticketsort.name}}-{{data.ticketsort.size}}cm-{{data.ticketsort.price}}元
              </span><span v-else>待配置</span></Col>
          </Row>
          <div class="tvm-block margin-top-10">
             <Row :gutter="20">
              <Col span="6" v-for="item in hasTvmList" :key="item.id">
                <router-link class="tvm-block-item" :to="{ name: 'tvminfo', params: { id: item.id }}">
                  <div class="tvm-name">单元机ID: {{item.tvmid}}</div>
                  <div class="data-block">
                    <div class="data-num">
                      <div>剩余</div>
                      <div class="num">{{item.ticketleft}}</div>
                      <div>/{{item.ticketnum}}</div>
                    </div>
                  </div>
                </router-link>
              </Col>
              <!-- <Col span="6">
                <div class="tvm-block-item">
                  <div class="tvm-name">单元机ID：0001</div>
                  <div class="data-block">
                    <div>
                      <div>剩余</div>
                      <div class="num">280</div>
                      <div>/500</div>
                    </div>

                  </div>
                </div>
              </Col>
              <Col span="6">
                <div class="tvm-block-item">
                  <div class="tvm-name">单元机ID：0001</div>
                  <div class="data-block">
                    <div>
                      <div>剩余</div>
                      <div class="num">280</div>
                      <div>/500</div>
                    </div>

                  </div>
                </div>
              </Col>
              <Col span="6">
                <div class="tvm-block-item">
                  <div class="tvm-name">单元机ID：0001</div>
                  <div class="data-block">
                    <div>
                      <div>剩余</div>
                      <div class="num">280</div>
                      <div>/500</div>
                    </div>

                  </div>
                </div>
              </Col> -->
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type="mouse"></Icon>
            管理设置阵列组
          </p>
          <Form ref="formInline" inline>
            <FormItem label="票种地域管理" :label-width="100" label-position="left">
              <Select style="width:200px" v-model="selectedAreaId" :label-in-value="true" @on-change="updateSelected">
                <Option v-for="item in areaList" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button @click="submitArea()" type="primary">确定</Button>
            </FormItem>
            <FormItem label="票种规格管理" :label-width="100" label-position="left">
              <Select style="width:250px;" v-model="selectedTicketSort" placeholder="请选择票种">
                <Option v-for="item in ticketSortList" :value="item.id" :key="item.id">
                  {{ item.name }} - {{item.size}}cm - {{item.price}}元</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="submitTicketsort()">确定</Button>
            </FormItem>
          </Form>
          <div class="tvm-edit-area">
            <div class="tvm-list">
              <Row :gutter="20">
                <Col span="6" v-for="item in hasTvmList" :key="item.id">
                  <div class="tvm-block-new">
                    <div class="tvm-title">单元机ID: {{item.tvmid}}</div>
                    <div class="tvm-name">{{item.tvmname}}</div>
                    <div class="tvm-status">运行中</div>
                    <div class="del-btn">
                      <Poptip
                        confirm
                        title="确定此操作吗?"
                        @on-ok="delTvm(item.id)"
                        >
                        <Button size="small" type="error">删除</Button>
                      </Poptip>
                    </div>
                  </div>
                </Col>
                <!-- <Col span="6">
                  <div class="tvm-block-new">
                    <div class="tvm-title">单元机ID</div>
                    <div class="tvm-name">大吉大利 - 10cm - 10元</div>
                    <div class="tvm-status">运行中</div>
                    <div class="del-btn"><Button size="small" type="error">删除</Button></div>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tvm-block-new">
                    <div class="tvm-title">单元机ID</div>
                    <div class="tvm-name">大吉大利 - 10cm - 10元</div>
                    <div class="tvm-status">运行中</div>
                    <div class="del-btn"><Button size="small" type="error">删除</Button></div>
                  </div>
                </Col>
                <Col span="6">
                  <div class="tvm-block-new">
                    <div class="tvm-title">单元机ID</div>
                    <div class="tvm-name">大吉大利 - 10cm - 10元</div>
                    <div class="tvm-status">运行中</div>
                    <div class="del-btn"><Button size="small" type="error">删除</Button></div>
                  </div>
                </Col> -->
              </Row>
            </div>

            <Form class="margin-top-10" inline>
              <FormItem label="设置单元机" :label-width="100" label-position="left">
                <Select style="width:200px" v-model="selectedTvmId">
                  <Option v-for="item in canUseTvmList" :value="item.id" :key="item.id">{{ item.tvmname }}</Option>
                </Select>
                <Button type="primary" @click="addTvm">添加单元机</Button>
              </FormItem>
            </Form>
          </div>

        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { tvmGroupInfo, updateTvmGroup, areaInfo, ticketSortList, canUseTvm, addTvmTogroup, currentTvmList, removeTvmFromGroup } from '@/server/api';

export default {
  data() {
    return {
      id: 0,
      data: {},
      areaList: [], // 区域列表
      ticketSortList: [], // 票种列表
      canUseTvmList: [], // 可以使用的单元机列表
      hasTvmList: [], // 当前已有的单元机列表
      selectedAreaId: '',
      selectedTvmId: '',
      selectedAreaName: '',
      selectedTicketSort: '',
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
    this.getInfo(this.id);
    this.getAreaInfo();
    this.getTicketSort();
    this.getCanUseTvm();
    this.getHasTvm();
  },
  mounted() {

  },
  methods: {
    addTvm() {
      const data = {
        tvmgroupid: this.id,
        id: this.selectedTvmId,
      };
      addTvmTogroup(data).then(res => {
        if (res.code === 0) {
          this.selectedTvmId = '';
          this.getCanUseTvm();
          this.getHasTvm();
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    // 获取可以使用的单元机
    getCanUseTvm() {
      canUseTvm().then(res => {
        this.canUseTvmList = res.data;
      });
    },
    updateSelected(e) {
      this.selectedAreaId = e.value;
      this.selectedAreaName = e.label;
    },
    // 更新所属区域
    submitArea() {
      const data = {
        id: this.id,
        data: {
          addressid: this.selectedAreaId,
          addressname: this.selectedAreaName,
        },
      };
      updateTvmGroup(data).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.$Message.success('更新成功!');
        } else {
          this.$Message.error('更新失败!');
        }
      });
    },
    // 更新票种
    submitTicketsort() {
      const data = {
        id: this.id,
        data: {
          ticketsortid: this.selectedTicketSort,
        },
      };
      updateTvmGroup(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('更新成功!');
        } else {
          this.$Message.error('更新失败!');
        }
      });
    },
    // 获取区域列表
    getAreaInfo() {
      areaInfo().then(res => {
        this.areaList = res.data;
      });
    },
    // 获取票种列表
    getTicketSort() {
      ticketSortList().then(res => {
        this.ticketSortList = res.data;
      });
    },
    getInfo(gid) {
      const data = {
        id: gid,
      };
      tvmGroupInfo(data).then(res => {
        if (res.code === 0) {
          this.selectedAreaId = res.data.addressid;
          this.selectedTicketSort = res.data.ticketsortid;
          this.data = res.data;
        }
      });
    },
    // 获取当前阵列组已有的单元机列表
    getHasTvm() {
      const data = {
        id: this.id,
      };
      currentTvmList(data).then(res => {
        console.log(res);
        this.hasTvmList = res.data;
      });
    },
    // 从阵列组里移除单元机
    delTvm(id) {
      const data = {
        tvmid: id,
      };
      removeTvmFromGroup(data).then(res => {
        if (res.code === 0) {
          this.getCanUseTvm();
          this.getHasTvm();
          this.$Message.success(res.msg);
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
  .tvm-block-new {
    border: 1px dashed #e9eaec;
    position: relative;
    padding: 20px 20px;
    height: 100px;
    font-size: 12px;
  }
  .tvm-block-new .del-btn{
    position: absolute;
    right: 5px;
    top: 5px;
  }
</style>
