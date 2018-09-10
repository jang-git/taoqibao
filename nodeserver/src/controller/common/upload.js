const fs = require('fs');

module.exports = class extends think.Controller {
  async indexAction() {
    return this.success('ok');
  }

  async taskAction() {
    const themefile = this.file('file');
    think.logger.warn(themefile);

    // const filepath = themefile.path;// 为防止上传的时候因文件名重复而覆盖同名已上传文件，path是MD5方式产生的随机名称
    // const uploadpath = think.RESOURCE_PATH + '/static/image/task';
    // think.mkdir(uploadpath);// 创建该目录
    // // 提取出用 ‘/' 隔开的path的最后一部分。
    // // let basename = path.basename(filepath);
    // const basename = themefile.originalFilename;// 因为本系统不允许上传同名主题，所以文件名就直接使用主题名
    // // 将上传的文件（路径为filepath的文件）移动到第二个参数所在的路径，并改为第二个参数的文件名。
    // fs.renameSync(filepath, uploadpath + '/' + basename);
    // themefile.path = uploadpath + '/' + basename;
    // // 读取压缩文件信息存数据库
    // // const zip = new JSZip();
    // this.success(themefile);
  }
};
