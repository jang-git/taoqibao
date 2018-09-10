module.exports = class extends think.Controller {
  async __before() {
    // 根据token值获取用户id
    this.ctx.state.token = this.ctx.header['x-taskplatform-token'] || '';
    const tokenSerivce = think.service('token');
    this.ctx.state.userId = await tokenSerivce.getUserId(this.ctx.state.token);

    const publicController = this.config('publicController');
    const publicAction = this.config('publicAction');

    // 如果为非公开，则验证用户是否登录
    const controllerAction = this.ctx.controller + '/' + this.ctx.action;

    think.logger.info('用户ID', this.ctx.state.userId);
    // think.logger.error(this.ctx.controller);
    // think.logger.error(controllerAction);

    if (!publicController.includes(this.ctx.controller) && !publicAction.includes(controllerAction)) {
      if (this.ctx.state.userId <= 0) {
        return this.fail(401, '请先登录');
      }
    }
  }
  /**
   * 获取时间戳
   * @returns {Number}
   */
  getTime() {
    return parseInt(Date.now() / 1000);
  }

  /**
   * 获取当前登录用户的id
   * @returns {*}
   */
  getLoginUserId() {
    return this.ctx.state.userId;
  }
};
