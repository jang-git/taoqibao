
module.exports = class extends think.Controller {
  async indexAction() {
    const page = this.get('page') || 1;

    const plist = await this.model('ceo').page(page, '30').select();
    return this.success(plist);
  }
};
