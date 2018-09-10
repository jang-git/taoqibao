module.exports = class extends think.Model {
  // 配置关联关系
  get relation() {
    return {
      task_type: { // 配置跟分类的关联关系
        type: think.Model.HAS_ONE,
        key: 'tid',
        fKey: 'id'
      }
    };
  }

  async updateBypay(ceoid, taskid, price, status) {
    try {
      await this.startTrans();
      const res1 = await this.where({id: taskid}).update({status: status});

      const user = this.model('ceo').db(this.db());
      const res2 = await user.where({id: ceoid}).decrement('balance', price);

      if (res1 > 0 && res2 > 0) {
        await this.commit();
      } else {
        await this.rollback();
      }
      return true;
    } catch (e) {
      await this.rollback();
      return false;
    }
  }
};