const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.success('okselfinfo');
  }
  async listAction() {
    const page = this.get('page') || 1;
    const res = await this.model('task').field('id,tid,sid,shop_name,product_name,product_url,product_img,createtime,status,nums').where({cid: this.ctx.state.userId}).page(page).order('createtime desc').countSelect();

    return this.success(res, '查询成功');
  }
  // 支付接口
  async paymentAction() {
    const taskid = this.post('taskid');
    const user = await this.model('ceo').where({id: this.ctx.state.userId}).find();
    const taskInfo = await this.model('task').where({id: taskid}).find();

    const userBalance = user.balance; // 用户金额
    const taskMoney = taskInfo.total_price; // 此次任务所需要的金额
    if (taskMoney === 0) {
      return this.fail('此次任务所需金额不合法');
    }
    if (userBalance < taskMoney) {
      return this.fail('余额不足,请先充值!');
    }

    const res1 = await this.model('ceo').where({id: this.ctx.state.userId}).decrement('balance', taskMoney);
    const res2 = await this.model('task').where({id: taskid}).update({status: 2}); // 切换到待审核状态

    if (res1 && res2) {
      return this.success('支付成功!');
    } else {
      return this.fail('支付出现错误!');
    }
  }

  async step2Action() {
    const taskid = this.post('taskid');

    const res = await this.model('task').field('task_charge').where({id: taskid}).find();
    if (think.isEmpty(res)) {
      return this.fail('不存在!');
    }
    const obj = JSON.parse(res.task_charge);
    if (think.isEmpty(obj)) {
      return this.fail('数据错误');
    }
    return this.success(obj, '查询成功');
  }
  async addAction() {
    const data = {};
    data.cid = this.ctx.state.userId;
    data.tid = this.post('tid');
    data.sid = this.post('sid');
    data.shop_name = this.post('shop_name');
    data.fantype = this.post('fantype');

    const pinfo = this.post('productInfo');
    think.logger.warn(pinfo);

    data.product_name = pinfo.product_name;
    data.product_url = pinfo.product_url;
    data.product_img = pinfo.product_img;
    data.product_actual_price = pinfo.product_actual_price;
    data.product_public_price = pinfo.product_public_price;
    data.product_count = pinfo.product_count;
    data.product_yffs = pinfo.product_yffs;
    data.order_method = pinfo.order_method;
    data.goods_address = pinfo.goods_address;

    data.total_price = this.post('moneyInfo').total;
    data.nums = this.post('moneyInfo').num;
    data.task_type_num = JSON.stringify(this.post('keywordInfo'));
    data.crontabs = JSON.stringify(this.post('crontabInfo'));
    data.task_charge = JSON.stringify(this.post('moneyInfo'));
    data.createtime = currentTime();

    const res = await this.model('task').add(data);
    if (res > 0) {
      return this.success(res, '添加成功!');
    } else {
      return this.fail('添加失败');
    }
  }
}
;
