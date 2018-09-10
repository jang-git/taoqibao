const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.success('ok');
  }
  // 商户可用的店铺
  async listaAction() {
    const data = await this.model('shop').where({cid: this.ctx.state.userId, shop_status: 1}).select();
    return this.success(data, '查询成功!');
  }
  async listAction() {
    const data = await this.model('shop').where({cid: this.ctx.state.userId}).select();
    return this.success(data, '查询成功!');
  }
  async bindshopAction() {
    const data = this.post();
    think.logger.info(data);
    const saveData = {
      pid: data.pid,
      cid: this.ctx.state.userId,
      shop_name: data.shop_name,
      master_wang: data.master_wang,
      shop_homeurl: data.shop_homeurl,
      send_name: data.send_name,
      send_phone: data.send_phone,
      send_province: data.send_province,
      send_city: data.send_city,
      send_area: data.send_area,
      send_address: data.send_address
    };

    const res = await this.model('shop').add(saveData);
    if (res > 0) {
      return this.success(res, '添加成功!');
    } else {
      return this.fail('添加失败!');
    }
  }

  async updateAction() {
    const shopid = this.post('shopid');
    const data = this.post('data');

    const saveData = {
      pid: data.pid,
      cid: this.ctx.state.userId,
      shop_name: data.shop_name,
      master_wang: data.master_wang,
      shop_homeurl: data.shop_homeurl,
      send_name: data.send_name,
      send_phone: data.send_phone,
      send_province: data.send_province,
      send_city: data.send_city,
      send_area: data.send_area,
      send_address: data.send_address
    };

    const res = await this.model('shop').where({id: shopid}).update(saveData);
    if (res > 0) {
      return this.success(res, '更新成功!');
    } else {
      return this.fail('更新失败!');
    }
  }
}
;
