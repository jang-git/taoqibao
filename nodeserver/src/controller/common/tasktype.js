
module.exports = class extends think.Controller {
  async indexAction() {
    const plist = await this.model('task_type').select();
    return this.success(plist);
  }
};
