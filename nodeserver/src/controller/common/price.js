
module.exports = class extends think.Controller {
  async indexAction() {
    // const pid = this.post('parentId') || '100000';
    const price = this.post('price');
    const cid = this.post('cid');

    const p = this.model('price');
    const res = await p.findPrice(cid, price);

    return this.success(res);
  }

  async listAction() {
    const cid = this.post('cid');
    const p = this.model('price');
    const res = await p.selectPrice(cid);
    return this.success(res);
  }
};
