
module.exports = class extends think.Controller {
  async indexAction() {
    // const pid = this.post('parentId') || '100000';

    const plist = await this.model('task_type').field('id,platform_id,tasktype_name').where({status: 0}).select();
    return this.success(plist);
  }
};
