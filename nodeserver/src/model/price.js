module.exports = class extends think.Model {
  // 配置关联关系

  async findPrice(cid, price) {
    if (think.isEmpty(price) || think.isEmpty(cid)) {
      return '';
    }
    let where = {};
    where = {
      min_price: ['<=', price],
      max_price: ['>=', price],
      category_id: cid
    };
    const res = await this.field('price').where(where).find();
    return res.price;
  }

  async selectPrice(cid) {
    if (think.isEmpty(cid)) {
      return [];
    }
    const res = await this.field('min_price, max_price, price').where({category_id: cid}).select();

    return res;
  }
};
