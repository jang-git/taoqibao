<style lang="less">
  @import '../../styles/common.less';
</style>
<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card>
          <Steps :current="current">
            <Step title="第一步" content="选择任务类型"></Step>
            <Step title="第二步" content="填写任务信息"></Step>
            <Step title="第三步" content="支付"></Step>
            <Step title="第四步" content="发布成功"></Step>
          </Steps>
        </Card>
      </Col>
    </Row>

    <div class="step-block" v-show="current===0">
      <Row class="margin-top-10" :gutter="10">
        <Col span="24">
          <Card>
            <p slot="title">
              1.选择任务类型
            </p>
            <RadioGroup v-model="step1.tid" vertical @on-change="changeTasktype">
              <Radio v-for="(item,index) in platformList" :key="index" :label="item.id">{{item.tasktype_name}}</Radio>
              <!-- <Radio label="102" :disabled="currentPlatform !== '102'">手机拼多多</Radio>
              <Radio label="103" :disabled="currentPlatform !== '103'">手机京东</Radio> -->
            </RadioGroup>
          </Card>
        </Col>
      </Row>

      <Row class="margin-top-10" :gutter="10">
        <Col span="24">
          <Card>
            <p slot="title">
              2.选择您的店铺 (如果没有，请先绑定店铺)
            </p>
            <RadioGroup v-model="step1.sid" vertical @on-change="changeShop">
              <Radio v-for="(item,index) in shoplist" :key="index" :disabled="currentTasktype.platform_id !== item.pid" :label="item.id">
                  <Icon type="social-apple"></Icon>
                  <span>{{item.shop_name}}</span>
              </Radio>
            </RadioGroup>
          </Card>
        </Col>
      </Row>

      <Row class="margin-top-10" :gutter="10">
        <Col span="24">
          <Card>
            <p slot="title">
              <Icon type="mouse"></Icon>
              选择平台返款模式
            </p>
            <RadioGroup v-model="step1.fantype" vertical>
              <Radio label="1">平台系统返款（收取服务费1元/单）</Radio>
            </RadioGroup>
          </Card>
        </Col>
      </Row>
    </div>

    <div class="step-block" v-show="current===1">
      <Form ref="form1" :model="pinfo" :rules="rules_pinfo" :label-width="110">
        <Row class="margin-top-10" :gutter="10">
          <Col span="24">
            <Card>
              <p slot="title">
                1.填写商品信息
              </p>
                <FormItem label="商品标题" prop="product_name">
                  <Input type="text" placeholder="" v-model="pinfo.product_name"></Input>
                </FormItem>
                <FormItem label="商品链接" prop="product_url">
                  <Input type="text" placeholder="" v-model="pinfo.product_url"></Input>
                </FormItem>
                <FormItem label="商品主图">
                  <Upload action="http://127.0.0.1:8360/common/upload/task">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                  </Upload>
                </FormItem>
                <FormItem label="每人购买" prop="product_count">
                  <InputNumber :max="500" :min="1" v-model="pinfo.product_count"></InputNumber> 件
                </FormItem>
                <FormItem label="商品售价" prop="product_actual_price">
                  <InputNumber :max="100000" :precision="2" :min="1" v-model="pinfo.product_actual_price"></InputNumber> 元
                </FormItem>
                <FormItem label="搜索展示价格" prop="product_public_price">
                  <InputNumber :max="100000" :precision="2" :min="1" v-model="pinfo.product_public_price"></InputNumber> 元
                </FormItem>
                <FormItem label="运费方式">
                  <RadioGroup v-model="pinfo.product_yffs">
                    <Radio :label="0">包邮</Radio>
                    <Radio :label="1">不包邮</Radio>
                  </RadioGroup>
                </FormItem>
              <!-- </Form> -->
            </Card>
          </Col>
        </Row>
        <Row class="margin-top-10" :gutter="10">
          <Col span="24">
            <Card>
              <p slot="title">
                2.如何找到您的商品：(提供相应信息以便用户模拟真实购物流程)
              </p>
                <FormItem label="商品排序方式" prop="title">
                  <Select placeholder="选择商品排序方式" v-model="pinfo.order_method" style="width:150px;">
                    <Option value="1">综合排序</Option>
                    <Option value="2">销量优先</Option>
                    <Option value="3">价格从低到高</Option>
                    <Option value="4">价格从高到低</Option>
                    <Option value="5">信用排序</Option>
                  </Select>
                </FormItem>

                <FormItem label="价格区间">
                  <InputNumber :max="10000" :min="1" v-model="pinfo.start_price"></InputNumber> 元 -   <InputNumber :max="10000" :min="1" v-model="pinfo.end_price"></InputNumber> 元
                </FormItem>
                <FormItem label="商品所在地">
                  <show-area @showParentCity="getcity($event)" :city="pinfo.goods_address" style="display:inline-block;"></show-area>
                </FormItem>
            </Card>
          </Col>
        </Row>
      </Form>

      <Row class="margin-top-10" :gutter="10">
        <Col span="24">
          <Card>
            <p slot="title">
              3.选择任务类型和单数
            </p>
            <div>
              <Card>
                <p slot="title">
                  <i-switch v-model="keywords1.ischeck" size="small"></i-switch>普通好评任务 ( 默认为5星无评价内容，如需评价请备注，但不可规定评价内容 )
                </p>
                <div v-if="keywords1.ischeck" class="searchnew">
                  <div class="searchitemnew" v-for="(item,index) in keywords1.data" :key="index">
                    <span class="tit">搜索关键词</span>
                    <Input type="text" v-model="item.keyword" style="width:180px;"></Input>
                    <span>添加垫付</span>
                    <InputNumber :max="10000" :min="1" v-model="item.num"></InputNumber>
                    单
                    <Button v-if="index>0" @click="delkeywords1(index)" type="error" size="small">删除</Button>
                  </div>
                  <Button @click="addkeywords1" type="primary" icon="plus" size="small">添加关键词</Button>
                </div>
              </Card>

              <Card class="margin-top-10">
                <p slot="title">
                  <i-switch v-model="keywords2.ischeck" size="small"></i-switch>指定文字好评任务 (文字好评任务佣金 + 3金/单 )
                </p>
                <div v-if="keywords2.ischeck" class="searchnew">
                  <div class="searchitemnew" v-for="(item,index) in keywords2.data" :key="index">
                    <span class="tit">搜索关键词</span>
                    <Input type="text" v-model="item.keyword" style="width:180px;"></Input>
                    <span>添加垫付</span>
                    <InputNumber :max="1" :min="1" v-model="item.num"></InputNumber>
                    单
                    <Button v-if="index>0" @click="delkeywords2(index)" type="error" size="small">删除</Button>
                    <div class="margin-top-10">
                      <Input type="textarea" v-model="item.content" :autosize="{minRows: 3,maxRows: 5}" placeholder="限999字内..."></Input>
                    </div>
                  </div>
                  <Button @click="addkeywords2" type="primary" icon="plus" size="small">添加关键词</Button>
                </div>
              </Card>

              <div class="crontab-setting">
                <div class="title">发布时间设置</div>
                <div class="time-item" v-for="(item,index) in crontabs" :key="index">
                  开始时间：<DatePicker type="datetime" v-model="item.startTime" format="yyyy-MM-dd HH:mm" placeholder="选择要发布的开始时间" style="width: 200px"></DatePicker>
                  每隔 <InputNumber :max="1000" :min="0" v-model="item.intervalTime"></InputNumber>分钟放出1单
                  共放 <InputNumber :max="1000" :min="1" v-model="item.releaseCount"></InputNumber>单
                  <Button v-if="index>0" @click="delContrab(index)" type="error" size="small">删除</Button>
                </div>
                <Button @click="addContrab" type="primary" icon="plus" size="small">添加放单计划</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <div class="step-block" v-show="current===2">
      <Row class="margin-top-10" :gutter="10">
        <Col span="24">
          <Card>
            <p slot="title">
              <Icon type="mouse"></Icon>
              本次任务费用详情
            </p>
            <table class="pay-detail">
              <tbody>
                <tr>
                <th width="15%">分类</th>
                <th width="40%">费用明细</th>
                <th width="15%">数量</th>
                <th width="30%">小计</th>
              </tr>

              <tr v-for="item in task_charge.yj.data" :key="item.type" :class="item.type === 1 ? 'top-border' : ''">
                <td :rowspan="task_charge.yj.data.length" v-if="item.type === 1">佣金</td>
                <td>
                  <div class="detail" style="text-align: left;padding-left: 55px;">
                    <p>{{chargeSort[item.type]}} {{item.price}}金/单</p>
                  </div>
                </td>
                <td>{{item.num}}单</td>
                <td>{{item.total}}金</td>
              </tr>
              <tr v-for="item in task_charge.bj.data" :key="item.type" :class="item.type === 3 ? 'top-border' : ''">
                <td :rowspan="task_charge.bj.data.length" v-if="item.type === 3">本金</td>
                <td>
                  <div class="detail" style="text-align: left;padding-left: 55px;">
                    <p>{{chargeSort[item.type]}} {{item.price}} 元/单</p>
                  </div>
                </td>
                <td>{{item.num}}单</td>
                <td>{{item.total}}元</td>
              </tr>

            </tbody>
            </table>
            <div class="pay-method">
              <div class="f-fl">
                <input type="radio" checked="checked">
                <span>
                使用账户余额支付 （可用本金 <span class="money">0.00</span>元，
                余额不够<a class="striking">马上充值</a>)
                </span>
              </div>
            </div>
            <div class="pay-total">
              合计单数： <span class="striking">{{task_charge.num}}</span>单<br>
              合计支付： 本金<span class="money">{{task_charge.bj.price}}</span>元 +  佣金<span class="money">{{task_charge.yj.price}}</span>金 = {{task_charge.total}} 元
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <Row class="updownarea" :gutter="10">
      <ButtonGroup>
        <Button type="primary" @click="pre()" :disabled="current === 0">
            <Icon type="chevron-left"></Icon>
            上一步
        </Button>
        <Button type="primary" @click="next()" :disabled="current === 3">
            下一步
            <Icon type="chevron-right"></Icon>
        </Button>
      </ButtonGroup>
    </Row>
    <Modal
      v-model="heduiModel"
      :mask-closable="false"
      :closable="false"
      title="核对商品信息"
      :loading="loading"
      :width = "600"
      @on-ok="tijiaoTask">
      <div class="hedui-cont">
        <div class="hedui-pic">
          <img :src="pinfo.product_img" alt="">
        </div>
        <div class="hedui-info">
          <div class="item">商品标题: <a :href="pinfo.product_url">{{pinfo.product_name}}</a></div>
          <div class="item">商品售价: {{pinfo.product_actual_price}}  | 搜索展示价: {{pinfo.product_public_price}}</div>
          <div class="item">店铺名称: {{currentShop.shop_name}}</div>
        </div>
      </div>
      <div class="notice-info">
        任务支付成功后，平台将在工作时间（周一至周日 9:00~18：00）按任务发布顺序人工审核，请务必确认任务信息准确，合理安排任务发布时间，耐心等待2个小时左右。如需加快任务发布速度，请联系QQ客服开通做标签免审用户资格
      </div>
    </Modal>
  </div>
</template>
<script>
import _ from 'lodash';
import moment from 'moment';
import { shopListUse, addTaskData, platform } from '@/server/api';
import showArea from './shoparea';


export default {
  name: 'step1',
  components: {
    showArea,
  },
  data() {
    return {
      wzhpyj: 3, // 文字好评的佣金价格
      jcyj: 10, // 基础佣金的价格
      ptfk: 1,


      heduiModel: false,
      current: 0,
      loading: true, // 核对信息model的确定按钮loading
      totalNum: 0, // 总单数
      // 表单规则==================================================
      rules_pinfo: {
        product_name: [
          { required: true, message: '必填项', trigger: 'blur' },
        ],
        product_url: [
          { required: true, message: '必填项', trigger: 'blur' },
        ],
        product_count: [
          { type: 'number', required: true, message: '必填项', trigger: 'change' },
        ],
        product_actual_price: [
          { type: 'number', required: true, message: '必填项', trigger: 'change' },
        ],
        product_public_price: [
          { type: 'number', required: true, message: '必填项', trigger: 'change' },
        ],
      },

      // 验证表单的合法性
      productInfoStatus: false,

      // 第一步====================================================
      // currentPlatform: '', // 当前选择的所属平台
      currentTasktype: '', // 当前选择的任务类型
      currentShop: '', // 当前选择的店铺
      shoplist: [], // 商铺列表
      platformList: [], // 平台列表
      step1: {
        sid: '',
        tid: '',
        fantype: '1',
      },
      // 第二步====================================================
      pinfo: {
        product_name: '???新科无线话筒手机全民k歌麦克风蓝牙家用电视唱歌神器音响一体全名k歌通用电容录音全能儿童卡拉ok话筒', // 商品标题
        product_url: 'https://detail.tmall.com/item.htm?id=567857881289&ali_refid=a3_430583_1006:1152204712:N:%E8%AF%9D%E7%AD%92%E9%9F%B3%E5%93%8D%E4%B8%80%E4%BD%93%E9%BA%A6%E5%85%8B%E9%A3%8E:1ea56e6394671de79f17dadda200884f&ali_trackid=1_1ea56e6394671de79f17dadda200884f&spm=a230r.1.14.1&sku_properties=165354720:6536025', // 商品链接
        product_img: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i3/3622410505/O1CN011FbKSg2lYKyKlWt_!!3622410505.jpg_430x430q90.jpg', // 商品主图地址
        product_count: 2, // 每人购买
        product_actual_price: 159, // 商品售价
        product_public_price: 180, // 搜索价格
        product_yffs: 0, // 运费方式
        // 如何找到商品
        order_method: '1', // 排序方式
        start_price: 1, // 价格区间
        end_price: 100,
        goods_address: '全国', // 商品所在地
        order_msg: '', // 订单留言
      },

      // 普通好评任务关键词
      keywords1: {
        ischeck: true, // 是否选中
        data: [
          {
            keyword: '地瓜',
            num: 22,
            type: 1, // 任务类型
          },
          {
            keyword: '红薯',
            num: 2,
            type: 1, // 任务类型
          },
        ],
      },
      // 好评带文字评价
      keywords2: {
        ischeck: false,
        data: [
          {
            keyword: '红薯',
            num: 1,
            content: '真的很好吃啊',
            type: 2,
          },
        ],
      },


      // 第三步====================================================

      data: {

      },
      // 计划任务
      crontabs: [
        {
          startTime: new Date(),
          intervalTime: 10, // 每隔X分钟
          releaseCount: 12, // 一共放出的单数
        },
        {
          startTime: '2018-09-11T16:52:41.135Z',
          intervalTime: 10, // 每隔X分钟
          releaseCount: 10, // 一共放出的单数
        },
      ],
      // 费用信息
      chargeSort: ['', '基础佣金', '文字好评', '平台返款服务费', '返款本金'],
      task_charge: {
        num: 0, // 总单数
        total: 0, // 总价格
        yj: {
          name: '佣金',
          price: 0,
          data: [
            // {
            //   type: 1, // 基础佣金
            //   price: 15.00,
            //   num: 15,
            //   total: 150.00,
            // },
            // {
            //   type: 2,
            //   price: 15.00,
            //   num: 15,
            //   total: 150.00,
            // },
          ],
        },
        bj: {
          name: '本金',
          price: 0,
          data: [
            // {
            //   type: 3,
            //   price: 15.00,
            //   num: 15,
            //   total: 15,
            // },
            // {
            //   type: 4,
            //   price: 15.00,
            //   num: 15,
            //   total: 7500,
            // },
          ],
        },
      },
    };
  },
  created() {
    this.getShopList();
    this.getPlatform();
    // console.log(this.task_charge);
  },
  methods: {
    // 获取平台数据
    getPlatform() {
      platform().then(res => {
        if (res.code === 0) {
          this.platformList = res.data;
        }
      });
    },
    // 提交任务信息
    tijiaoTask() {
      // this.orderDetail();
      // console.log(this.crontabs);
      const crontabData = _.map(this.crontabs, val => {
        const data = {
          intervalTime: val.intervalTime,
          releaseCount: val.releaseCount,
          startTime: moment(val.startTime).unix(),
        };
        return data;
      });

      let keywords = [];
      if (this.keywords1.ischeck) {
        keywords = keywords.concat(this.keywords1.data);
      }
      if (this.keywords2.ischeck) {
        keywords = keywords.concat(this.keywords2.data);
      }

      const dataTask = {
        tid: this.step1.tid,
        sid: this.step1.sid,
        shop_name: this.currentShop.shop_name,
        fantype: this.step1.fantype,
        moneyInfo: this.task_charge,
        productInfo: this.pinfo,
        crontabInfo: crontabData,
        keywordInfo: keywords,
      };

      addTaskData(dataTask).then(res => {
        if (res.code === 0) {
          this.$Message.success('任务添加成功,');
          this.$router.push({ name: 'step2', params: { taskid: res.data } });
        } else {
          this.$Message.error('任务添加失败!');
        }
        this.heduiModel = false;
      });
    },
    // 计算订单详情信息
    orderDetail() {
      this.task_charge.num = this.totalNum;
      // totalPrice += this.pinfo.product_actual_price;
      // totalPrice += this.totalNum * 1;

      const yj = {
        type: 1,
        num: this.totalNum,
        price: this.jcyj.toFixed(2),
        total: this.jcyj * this.totalNum,
      };
      this.task_charge.yj.data.push(yj); // 基础佣金
      // 文字评价佣金
      if (this.taskKeywords.keywords2.ischeck) {
        const tNum = _.sumBy(this.taskKeywords.keywords2.data, 'num');
        const totalPrice = this.wzhpyj * tNum;
        const val = {
          type: 2,
          num: tNum,
          price: this.wzhpyj.toFixed(2),
          total: totalPrice,
        };
        this.task_charge.yj.data.push(val);
      }
      // 图文评价佣金
      // 平台返款服务费
      const serviceMoney = {
        type: 3,
        num: this.totalNum,
        price: this.ptfk.toFixed(2),
        total: this.ptfk * this.totalNum,
      };
      this.task_charge.bj.data.push(serviceMoney);
      // 平台本金费用
      const benjin = {
        type: 4,
        num: this.totalNum,
        price: this.pinfo.product_actual_price.toFixed(2),
        total: this.pinfo.product_actual_price * this.totalNum,
      };
      this.task_charge.bj.data.push(benjin);
      this.task_charge.yj.price = _.sumBy(this.task_charge.yj.data, 'total').toFixed(2);
      this.task_charge.bj.price = _.sumBy(this.task_charge.bj.data, 'total').toFixed(2);
      this.task_charge.total = (_.sumBy(this.task_charge.yj.data, 'total') + _.sumBy(this.task_charge.bj.data, 'total')).toFixed(2);
    },
    // 切换任务类型
    changeTasktype(val) {
      this.currentTasktype = _.find(this.platformList, { id: val });
    },
    // 切换店铺
    changeShop(val) {
      const ty = _.find(this.shoplist, { id: val });
      this.currentShop = ty;
    },
    // 获取店铺数据列表
    getShopList() {
      shopListUse().then(res => {
        this.shoplist = res.data;
      });
    },
    pre() {
      if (this.current !== 0) {
        this.current = this.current - 1;
      }
    },
    next() {
      if (this.current === 0) {
        if (this.step1.id === '' || this.step1.tid === '') {
          this.$Message.warning('请选择完全再进行下一步!');
          return false;
        } else {
          this.current = 1;
          return true;
        }
      }
      if (this.current === 1) {
        this.$refs.form1.validate(valid => {
          if (valid) {
            this.productInfoStatus = true;
          } else {
            this.productInfoStatus = false;
          }
        });
        if (!this.productInfoStatus) {
          this.$Message.error('请完善商品信息');
          return false;
        }

        if (this.keywords1.ischeck === false && this.keywords2.ischeck === false) {
          this.$Message.error('请至少选择一种任务类型');
          return false;
        }

        if (this.keywords1.ischeck) {
          if (!this.jianceKeyword1()) {
            this.$Message.error('请完善普通好评关键词信息');
            return false;
          }
        }
        if (this.keywords2.ischeck) {
          if (!this.jianceKeyword2()) {
            this.$Message.error('请完善关指定文字好评键词信息');
            return false;
          }
        }

        if (!this.jianceTimer()) {
          this.$Message.error('请完善发布时间!');
          return false;
        }
        if (!this.jianceNum()) {
          this.$Message.error('放单计划量必须等于总单量!');
          return false;
        }

        this.heduiModel = true;
      }
      return 'ok';
    },
    // 检测总单数和计划任务数是否相等
    jianceNum() {
      let num1 = 0;
      let num2 = 0;
      if (this.keywords1.ischeck) {
        num1 += _.sumBy(this.keywords1.data, 'num');
      }
      if (this.keywords2.ischeck) {
        num1 += _.sumBy(this.keywords2.data, 'num');
      }
      // _.map(this.taskKeywords, (value, key) => {
      //   console.log(value);
      //   console.log(key);
      //   if (value.ischeck) {
      //     num1 += _.sumBy(value.data, 'num');
      //   }
      // });

      num2 = _.sumBy(this.crontabs, 'releaseCount');

      if (num1 === num2) {
        this.totalNum = num2;
        return true;
      } else {
        return false;
      }
    },
    jianceTimer() {
      for (let i = 0; i < this.crontabs.length; i += 1) {
        if (!this.crontabs[i].startTime || !this.crontabs[i].intervalTime || !this.crontabs[i].releaseCount) {
          return false;
        }
      }
      return true;
    },
    jianceKeyword1() {
      const datajian = this.keywords1.data;
      for (let i = 0; i < datajian.length; i += 1) {
        if (!datajian[i].keyword || !datajian[i].num) {
          return false;
        }
      }
      return true;
    },
    jianceKeyword2() {
      const datajian = this.keywords2.data;
      for (let i = 0; i < datajian.length; i += 1) {
        if (!datajian[i].keyword || !datajian[i].num || !datajian[i].content) {
          return false;
        }
      }
      return true;
    },
    // 普通关键词任务
    addkeywords1() {
      if (this.keywords1.data.length < 5) {
        const data = {
          keyword: '',
          num: 1,
          type: 1,
        };
        this.keywords1.data.push(data);
      }
    },
    delkeywords1(index) {
      this.keywords1.data.splice(index, 1);
    },
    // 关键词带评价任务
    addkeywords2() {
      if (this.keywords2.data.length < 5) {
        const data = {
          keyword: '',
          num: 1,
          type: 2,
        };
        this.keywords2.data.push(data);
      }
    },
    delkeywords2(index) {
      this.keywords2.data.splice(index, 1);
    },
    // 添加计划任务
    addContrab() {
      const data = {
        startTime: '',
        intervalTime: 30, // 每隔X分钟
        releaseCount: 1, // 一共放出的单数
      };
      this.crontabs.push(data);
    },
    delContrab(index) {
      this.crontabs.splice(index, 1);
    },
    // 子组件传给父组件的city
    getcity(event) {
      this.pinfo.goods_address = event;
    },
    // 完成付款
    payment() {
      this.$Modal.confirm({
        title: '友情提示',
        content: '确定付款了吗？任务发布成功，不能再次修改！',
        onOk: () => {
          this.$Message.info('完成付款');
        },
        onCancel: () => {
          this.$Message.info('取消付款');
        },
      });
    },
  },
};
</script>

<style scoped>
  .shop-block {
    padding: 15px 15px;
    border: 1px solid #eee;
    width: 200px;
    height: 80px;
    margin-right: 10px;
    display: inline-block;
  }
  .shop-block.active {
    border-color: #2d8cf0;
  }
  .tongji {
    padding: 15px 15px;
    text-align: right;
  }
  .zdy table{
    width: 100%;
  }
  .updownarea{
    text-align: center;
    padding: 20px 15px;
  }
  .keywords {
    font-size: 12px;
  }
  .keyword-block {
    position: relative;
    padding: 20px 30px;
  }
  .keytit {
    padding: 15px 0;
  }
  .keyword-del {
    position: absolute;
    right: 30px;
    top: 10px;
  }
  .hedui-tit {
    font-weight: bold;
    padding: 15px 0;
  }
  .hedui-cont {
    overflow: hidden;
  }
  .hedui-pic {
    width: 150px;
    margin-right: 20px;
    float: left;
  }
  .hedui-pic img {
    max-width: 100%;
  }
  .hedui-info {
    font-size: 14px;
    font-weight: bold;
  }
  .hedui-info .item {
    margin-bottom: 10px;
  }
  .notice-info {
    padding: 10px 0;
    line-height: 1.5;

  }
  .searchitemnew {
    margin-bottom: 15px;
    font-size: 12px;
  }
  .crontab-setting{
    font-size: 12px;
    padding: 10px 10px;
  }
  .crontab-setting .title {
    font-size: 14px;
    margin-bottom: 15px;
  }
  .crontab-setting .time-item {
    margin-bottom: 10px;

  }

</style>
