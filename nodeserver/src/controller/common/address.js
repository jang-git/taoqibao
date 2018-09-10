
module.exports = class extends think.Controller {
  async indexAction() {
    const pid = this.post('parentId') || '100000';

    const plist = await this.model('address').field('Code,Name').where({ParentId: pid}).select();
    return this.success(plist);
  }

  async testAction() {
    const a = this.model('task');
    const ccc = await a.updateBypay();
    think.logger.info(ccc);
  }
};
