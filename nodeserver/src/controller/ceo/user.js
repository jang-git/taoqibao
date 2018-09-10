const Base = require('./base.js');

module.exports = class extends Base {
  // 用户基本信息
  async infoAction() {
    const userInfo = await this.model('ceo').where({id: this.getLoginUserId()}).find();
    delete userInfo.password;
    return this.success(userInfo);
  }

  /**
   * 保存用户头像
   * @returns {Promise.<void>}
   */
  async saveAvatarAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }

    // const avatarPath = think.RESOURCE_PATH + `/static/user/avatar/${this.getLoginUserId()}.` + _.last(_.split(avatar.path, '.'));

    // fs.rename(avatar.path, avatarPath, function(res) {
    //   return this.success();
    // });
  }
};
