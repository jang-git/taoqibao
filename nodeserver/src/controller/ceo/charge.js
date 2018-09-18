const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    this.success('');
  }
  async listAction() {
    const res = await this.model('ceo_recharge').where({ceo_id: this.getLoginUserId()}).order('id desc').select();
    return this.success(res);
  }
  async addAction() {
    const data = {};
    data.ceo_id = this.getLoginUserId();
    data.bankname = this.post('bankname');
    data.cardnumber = this.post('cardnumber');
    data.accountname = this.post('accountname');
    data.money = this.post('money');
    data.createtime = this.getTime();

    if (data.bankname === '' || data.cardnumber === '' || data.accountname === '' || data.money === null) {
      return this.fail('提交失败');
    }
    const res = await this.model('ceo_recharge').add(data);
    if (res > 0) {
      return this.success('', '提交成功');
    } else {
      return this.fail('提交失败');
    }
  }
};
