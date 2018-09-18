const _ = require('lodash');
const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const res = await this.model('task_keywords').where({task_id: 4}).select();
    think.logger.warn(res);
    return this.success(this.getTime());
  }
  async listAction() {
    const page = this.get('page') || 1;
    const res = await this.model('task').where({ceo_id: this.getLoginUserId()}).page(page).order('createtime desc').countSelect();

    return this.success(res, '查询成功');
  }
  // 支付接口
  async paymentAction() {
    const taskid = this.post('taskid');
    if (think.isEmpty(taskid)) {
      return this.fail('参数不完整');
    }
    const user = await this.model('ceo').field('id, capital').where({id: this.ctx.state.userId}).find();
    const taskInfo = await this.model('task').taskSingle(taskid);

    if (think.isEmpty(user) || think.isEmpty(taskInfo)) {
      think.logger.warn(user);
      return this.fail('查询错误!');
    }
    const userBalance = user.capital; // 用户本金
    const taskMoney = taskInfo.total_price; // 此次任务所需要的金额

    if (taskInfo.status !== 1) {
      return this.fail('任务已支付过!');
    }
    if (taskMoney === 0) {
      return this.fail('此次任务所需金额不合法');
    }
    if (userBalance < taskMoney) {
      return this.fail('余额不足,请先充值!');
    }

    const payAct = await this.model('pay');
    const res = await payAct.payTask(taskid, this.ctx.state.userId, taskMoney);
    if (res) {
      return this.success('', '支付成功');
    } else {
      return this.fail('服务器错误!');
    }
  }

  async step2Action() {
    const taskid = this.post('taskid');

    const yj = await this.model('task_price').field('price, pricetype,num, total_amount').where({task_id: taskid, type: 1}).select();
    const bj = await this.model('task_price').field('price, pricetype,num, total_amount').where({task_id: taskid, type: 2}).select();
    const total = await this.model('task').field('nums, total_price').where({id: taskid}).find();
    const res = {
      yj: yj,
      bj: bj,
      total: total
    };
    return this.success(res, '查询成功');
  }
  // 添加任务
  async addAction() {
    const pinfo = this.post('productInfo');
    const keyData = this.post('keywordInfo'); // 关键词数据任务
    const crontabs = this.post('crontabInfo');
    const ceoid = this.getLoginUserId();
    const taskData = {};
    const productData = {};

    // 任务信息
    taskData.ceo_id = ceoid;
    taskData.shop_id = this.post('shop_id');
    taskData.task_type_id = this.post('task_type_id'); // 任务类型
    taskData.fantype = this.post('fantype'); // 平台返款 1元服务费
    taskData.nums = 0; // 任务总单数
    taskData.total_price = 0; // 任务总价格
    taskData.createtime = this.getTime();

    // 商品信息
    productData.ceo_id = ceoid;
    productData.product_name = pinfo.product_name; // 产品标题
    productData.product_url = pinfo.product_url; // 产品地址
    productData.product_img = pinfo.product_img; // 产品图片
    productData.product_actual_price = pinfo.product_actual_price; // 实际价格
    productData.product_public_price = pinfo.product_public_price; // 搜索价格
    productData.product_count = pinfo.product_count; // 所需购买件数
    productData.is_post = pinfo.product_yffs; // 是否包邮
    productData.sort_order = pinfo.order_method; // 排序方式
    productData.product_address = pinfo.goods_address; // 商品所在地
    productData.createtime = this.getTime();

    // 这是实际要垫付的金额 需要计算出佣金
    const dianfujine = productData.product_count * productData.product_actual_price;
    // 计算出佣金
    const yongjin = await this.model('price').findPrice(taskData.task_type_id, dianfujine);

    if (think.isEmpty(yongjin)) {
      return this.fail('佣金计算出错!');
    }

    // 计算总单数
    taskData.nums = _.sumBy(keyData, 'num');

    const feedataDetail = []; // 这里是费用详情数据
    // type 表示大类型 1佣金 2本金
    // pricetype 表示费用类型 1基础佣金2文字评价佣金3图片评价佣金4平台服务费5返款本金

    const feeJcyj = { // 基础佣金
      type: 1,
      pricetype: 1,
      num: taskData.nums,
      price: yongjin,
      total_amount: taskData.nums * yongjin
    };
    feedataDetail.push(feeJcyj);

    const groupTask = _.groupBy(keyData, function(o) { // 分组关键词任务
      return o.type;
    });

    _.forEach(groupTask, function(val, key) {
      if (key === 2) { // 说明有文字评价内容
        const wzyj = 3; // 文字评价内容多加 3元佣金
        const wznum = _.sumBy(val, 'num');
        const wzyjData = {
          type: 1,
          pricetype: 2,
          num: wznum,
          price: wzyj,
          total_amount: wznum * wzyj
        };
        feedataDetail.push(wzyjData);
      }
      if (key === 3) { // 说明有图片文字评价内容
        const twyj = 5; // 图文评价内容多加 5元佣金
        const twnum = _.sumBy(val, 'num');
        const twyjData = {
          type: 1,
          pricetype: 2,
          num: twnum,
          price: twyj,
          total_amount: twnum * twyj
        };
        feedataDetail.push(twyjData);
      }
      think.logger.warn(val);
      think.logger.warn(key);
    });

    // 平台服务费用
    const feePt = {
      type: 2,
      pricetype: 4,
      num: taskData.nums,
      price: 1, // 这里是平台服务费用
      total_amount: taskData.nums * 1
    };
    feedataDetail.push(feePt);
    const feeJcbj = { // 基础本金
      type: 2,
      pricetype: 5,
      num: taskData.nums,
      price: dianfujine, // 这里是需要垫付的金额
      total_amount: taskData.nums * dianfujine
    };
    feedataDetail.push(feeJcbj);

    // const keywords1 = this.post('keywords1');
    // if (keywords1 && keywords1.ischeck === true) {
    //   keywordsList = keywordsList.concat(keywords1.data);
    // }
    // const keywords2 = this.post('keywords2');
    // if (keywords2 && keywords2.ischeck === true) {
    //   keywordsList = keywordsList.concat(keywords1.data);
    // }

    // 计算收费详情数据

    // 处理关键词任务类型 关键词类型1.普通任务；2文字任务；3图片任务；4.浏览任务；5.特别任务；6.裂变任务

    taskData.total_price = _.sumBy(feedataDetail, 'total_amount'); // 总金额

    const taskid = await this.model('task').add(taskData);

    productData.task_id = taskid;
    await this.model('task_product').add(productData);

    for (const val of keyData) {
      val.task_id = taskid;
      val.ceo_id = ceoid;
      await this.model('task_keywords').add(val);
    }

    // 入库定时任务
    const modelcronData = _.map(crontabs, val => {
      const crontabData = {
        task_id: taskid,
        ceo_id: ceoid,
        start_time: val.startTime,
        step_minute: val.intervalTime,
        num: val.releaseCount
      };
      return crontabData;
    });
    await this.model('task_crontab').addMany(modelcronData);
    // 入库收费详情
    const feeModelData = _.map(feedataDetail, function(o) {
      const val = o;
      val.task_id = taskid;
      val.ceo_id = ceoid;
      return val;
    });
    await this.model('task_price').addMany(feeModelData);

    if (taskid > 0) {
      return this.success(taskid, '添加成功!');
    } else {
      return this.fail('添加失败');
    }
  }
}
;
