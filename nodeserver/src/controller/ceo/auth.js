const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.success('ok');
  }
  async loginAction() {
    const userModel = this.model('ceo');

    const accno = this.post('accno');
    const password = this.post('password');
    think.logger.warn(this.post());
    if (think.isEmpty(accno) || think.isEmpty(password)) {
      return this.fail('参数不完整');
    }
    const user = await userModel.where({accno: accno, password: think.md5(password)}).find();

    if (think.isEmpty(user)) {
      return this.fail('登录失败');
    }
    delete user.password;
    // const sessionData = JSON.parse(user);
    const sessionData = {};
    sessionData.user_id = user.id;
    think.logger.info(user);
    // return false;
    const TokenSerivce = this.service('token');
    const sessionKey = await TokenSerivce.create(sessionData);

    if (think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    return this.success({ token: sessionKey, userInfo: user }, '登录成功');
  }

  async regAction() {
    const accno = this.post('accno');
    const password = this.post('password');
    if (think.isEmpty(accno) || think.isEmpty(password)) {
      return this.fail('参数不完整');
    }

    const userId = await this.model('ceo').add({
      accno: accno,
      password: think.md5(password)
    });
    think.logger.info(userId);

    const newUserInfo = await this.model('ceo').where({ id: userId }).find();
    delete newUserInfo.password;
    const sessionData = {};
    sessionData.user_id = userId;
    const TokenSerivce = this.service('token');
    const sessionKey = await TokenSerivce.create(sessionData);
    if (think.isEmpty(sessionKey) || think.isEmpty(userId)) {
      return this.fail('注册失败!');
    }
    return this.success({ token: sessionKey, userInfo: newUserInfo }, '注册成功!');
  }
  logoutAction() {
    return this.success();
  }
};
