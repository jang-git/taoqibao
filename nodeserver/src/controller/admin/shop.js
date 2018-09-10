const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.success('ok');
  }
  async listAction() {
    const where = {};
    const page = this.post('page') || 1;
    const data = await this.model('shop').where(where).page(page, '30').countSelect();
    return this.success(data, '查询成功!');
  }
  // 审核店铺操作
  async checkshopAction() {
    const shopid = this.post('shopid');
    const status = this.post('status');
    const res = await this.model('shop').where({id: shopid}).update({shop_status: status});
    if (res > 0) {
      return this.success('提交成功!');
    } else {
      return this.fail('提交失败!');
    }
  }
}
;
