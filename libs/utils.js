const bcrypt = require('bcryptjs');
const log = require('./log')

const util = {
  /*密码加密*/
  enbcrypt(password) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  // 统一抛出错误
  publicError(e) {
    let msg = ''
    if (typeof e === 'string') msg = e;// 自己抛出的错误
    else if (Array.isArray(e.errors)) msg = e.errors[0].message; //表单验证的错误信息
    else msg = e; //不知名的错误
    return msg
  },
  // 统一的返还信息 需要进行操作日志书写
  publicBody(ctx, result, userInfo) {
    ctx.body = result
    if (userInfo.type === "cms") {
      log(ctx, result.status, userInfo)
    }
  }
}

module.exports = util
