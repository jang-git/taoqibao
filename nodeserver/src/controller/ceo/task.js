const _ = require('lodash');
const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    // const a = [
    //   {
    //     num: 1,
    //     key: 'a'
    //   },
    //   {
    //     num: 2,
    //     key: 'a'
    //   },
    //   {
    //     num: 3,
    //     key: 'a'
    //   }
    // ];

    // const bb = _.sumBy(a, 'num');

    // think.logger.warn(bb);
    return this.success(currentTime());
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

    const yj = await this.model('task_price').field('CAST(price AS CHAR) AS price, pricetype,num, CAST(total_amount AS CHAR) AS total_amount').where({task_id: taskid, type: 1}).select();
    const bj = await this.model('task_price').field('CAST(price AS CHAR) AS price, pricetype,num, CAST(total_amount AS CHAR) AS total_amount').where({task_id: taskid, type: 1}).where({task_id: taskid, type: 2}).select();
    const res = {
      yj: yj,
      bj: bj
    };
    return this.success(res, '查询成功');
  }
  // 添加任务
  async addAction() {
    const pinfo = this.post('productInfo');
    const keyData = this.post('keywordInfo');
    const crontabs = this.post('crontabInfo');

    const data = {};
    data.cid = this.ctx.state.userId;
    data.tid = this.post('tid');
    data.sid = this.post('sid');
    data.shop_name = this.post('shop_name');
    data.fantype = this.post('fantype');

    data.product_name = pinfo.product_name;
    data.product_url = pinfo.product_url;
    data.product_img = pinfo.product_img;
    data.product_actual_price = pinfo.product_actual_price;
    data.product_public_price = pinfo.product_public_price;
    data.product_count = pinfo.product_count;
    data.product_yffs = pinfo.product_yffs;
    data.order_method = pinfo.order_method;
    data.goods_address = pinfo.goods_address;

    // data.total_price = this.post('moneyInfo').total;
    //
    // data.task_type_num = JSON.stringify(this.post('keywordInfo'));
    // data.crontabs = JSON.stringify(this.post('crontabInfo'));
    // data.task_charge = JSON.stringify(this.post('moneyInfo'));
    data.createtime = currentTime();
    const dianfujine = data.product_count * data.product_actual_price; // 这是实际要垫付的金额 需要计算出佣金
    const yongjin = await this.model('price').findPrice(data.tid, dianfujine); // 计算出佣金

    if (think.isEmpty(yongjin)) {
      return this.fail('佣金计算出错!');
    }

    const keyNum = _.sumBy(keyData, 'num');
    const croNum = _.sumBy(crontabs, 'releaseCount');
    const orderTotal = keyNum === croNum ? keyNum : 0; // 计算出总单数

    if (orderTotal === 0) {
      return this.fail('单数总量不匹配');
    }
    data.nums = orderTotal;

    const taskid = await this.model('task').add(data);
    // 处理关键词任务类型 关键词类型1.普通任务；2文字任务；3图片任务；4.浏览任务；5.特别任务；6.裂变任务

    const modelcronData = _.map(crontabs, val => {
      const crontabData = {
        taskid: taskid,
        cid: this.ctx.state.userId,
        start_time: val.startTime,
        step_minute: val.intervalTime,
        num: val.releaseCount
      };
      return crontabData;
    });

    // 处理普通任务关键词
    // if (keyData.keywords1.ischeck) {
    //   for (let i = 0; i < keyData.keywords1.data.length; i++) {
    //     const data = {
    //       taskid: taskid,
    //       type: 1,
    //       name: keyData.keywords1.data[i].keyword,
    //       num: keyData.keywords1.data[i].num, // 1个关键词的任务数量
    //       dfzj: dianfujine,
    //       yj: yongjin, // 普通任务没有附加金额
    //       fjje: 0,
    //       createtime: currentTime()
    //     };
    //     await this.model('task_keywords').add(data);
    //   }
    // }
    // 处理文字任务关键词
    // if (keyData.keywords2.ischeck) {
    //   for (let i = 0; i < keyData.keywords2.data.length; i++) {
    //     const data = {
    //       taskid: taskid,
    //       type: 2,
    //       name: keyData.keywords2.data[i].keyword,
    //       pj_content: keyData.keywords2.data[i].content,
    //       num: keyData.keywords2.data[i].num, // 1个关键词的任务数量
    //       dfzj: dianfujine,
    //       yj: yongjin, // 普通任务没有附加金额
    //       fjje: 3,
    //       createtime: currentTime()
    //     };
    //     await this.model('task_keywords').add(data);
    //   }
    // }

    // 处理计划任务数据结构

    // for (let i = 0; i < crontabs.length; i++) {
    //   const crontabData = {
    //     taskid: taskid,
    //     cid: this.ctx.state.userId,
    //     start_time: crontabs[i].startTime,
    //     step_minute: crontabs[i].intervalTime,
    //     num: crontabs[i].releaseCount,
    //     createtime: currentTime()
    //   };
    //   await this.model('task_crontab').add(crontabData);
    // }

    // 生成费用详情
    const feeData = []; // 批量插入数据库

    const feeJcyj = { // 基础佣金
      type: 1, // 大类型 1佣金 2本金
      pricetype: 1,
      task_id: taskid,
      cid: this.ctx.state.userId,
      num: orderTotal,
      price: yongjin,
      total_amount: orderTotal * yongjin
    };
    feeData.push(feeJcyj);

    const keyword2data = _.filter(keyData, function(o) {
      return o.type === 2;
    });

    // 如果有文字评价任务
    if (keyword2data.length > 0) {
      const keywords2Num = _.sumBy(keyword2data, 'num');
      const wzyj = 3;
      const feeWzyj = { // 文字任务评价附加金额
        type: 1,
        pricetype: 2,
        task_id: taskid,
        cid: this.ctx.state.userId,
        num: keywords2Num,
        price: wzyj,
        total_amount: keywords2Num * wzyj
      };
      feeData.push(feeWzyj);
    }
    // 平台服务费用
    const feePt = {
      type: 2,
      pricetype: 4,
      task_id: taskid,
      cid: this.ctx.state.userId,
      num: orderTotal,
      price: 1, // 这里是平台服务费用
      total_amount: orderTotal * 1
    };
    feeData.push(feePt);
    const feeJcbj = { // 基础本金
      type: 2,
      pricetype: 5,
      task_id: taskid,
      cid: this.ctx.state.userId,
      num: orderTotal,
      price: dianfujine, // 这里是需要垫付的金额
      total_amount: orderTotal * dianfujine
    };
    feeData.push(feeJcbj);

    _.map(keyData, async val => {
      const v = val;
      v.taskid = taskid;
      await this.model('task_keywords').add(v);
      // return v;
    });

    await this.model('task_crontab').addMany(modelcronData);
    // await this.model('task_keywords').addMany(modelkeyData);
    await this.model('task_price').addMany(feeData);

    if (taskid > 0) {
      return this.success(taskid, '添加成功!');
    } else {
      return this.fail('添加失败');
    }
  }
}
;
