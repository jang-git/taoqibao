
module.exports = class extends think.Controller {
  async indexAction() {
    // const pid = this.post('parentId') || '100000';

    const plist = await this.model('platform').field('id,platform_name').select();
    return this.success(plist);
  }
};
