module.exports = class extends think.Model {
  // 支付任务流程 支付完更改表的数据状态 然后进入审核状态
  async payTask(taskid, ceoid, money) {
    const keywords = await this.model('task_keywords').where({task_id: taskid}).select();
    const crontabs = await this.model('task_crontab').where({task_id: taskid}).select();
    // let publishTime = 0;
    // if (think.isEmpty(crontabs)) {
    //   publishTime = this.getTime();
    // }
    const crontabData = [];
    for (let i = 0; i < crontabs.length; i++) {
      for (let m = 0; m < crontabs[i].num; m++) {
        const time = crontabs[i].start_time + (crontabs[i].step_minute * 60 * m);
        crontabData.push(time);
      }
    }
    // 新增任务订单数据表
    const orderdata = [];
    for (let i = 0; i < keywords.length; i++) {
      for (let m = 0; m < keywords[i].num; m++) {
        const datakey = {
          task_id: taskid,
          keyword: keywords[i].keyword,
          capital: keywords[i].dfzj,
          commision: keywords[i].yj,
          createtime: this.getTime()
        };
        orderdata.push(datakey);
      }
    }
    think.logger.info(orderdata.length);
    if (orderdata.length !== crontabData.length) {
      return false;
    }
    for (let i = 0; i < orderdata.length; i++) {
      orderdata[i].publish_time = crontabData[i];
    }
    think.logger.warn(orderdata);
    // return false;
    try {
      await this.startTrans();
      const ceo = this.model('ceo').db(this.db());
      const task = this.model('task').db(this.db());
      const taskOrder = this.model('task_order').db(this.db());

      const res1 = await task.where({id: taskid}).update({status: 2});
      const res2 = await ceo.where({id: ceoid}).decrement('capital', money);
      const res3 = await taskOrder.addMany(orderdata);

      if (res1 > 0 && res2 > 0 && res3.length === orderdata.length) {
        await this.commit();
        return true;
      } else {
        await this.rollback();
        return false;
      }
      // return true;
    } catch (e) {
      await this.rollback();
      return false;
    }
  }

  getTime() {
    return parseInt(Date.now() / 1000);
  }
};
