/**
 * sql语句
 * */

/**
 * 前端程序
 * */
const applets = {
  userSql: {
    insert: "INSERT INTO users (id,username,password,mobile) VALUES (?,?,?,?,?)",
    // 动态控制 通过body传来的数据动态更新用户的信息
    update: (body, id) => {
      let param = ''
      for (let i in body) {
        param += `${i} = '${body[i]}',`
      }
      param = param.substr(0, param.length - 1)
      return `UPDATE users SET ${param} WHERE id = '${id}'`
    },
    check: "SELECT id,username,password,mobile FROM users WHERE mobile = ?",//查找当前用户是否存在于数据库
    userInfo: "SELECT id,username,password,mobile FROM users WHERE id = ?"//查找当前用户是否存在于数据库
  }
};

/**
 * 后台cms
 * */
const cms = {
  //后台用户登录
  adminCmsSql: {
    check: "SELECT id,username,password,mobile FROM admin WHERE mobile = ?",//查找当前手机号是否存在于数据库
    insert: "INSERT INTO admin (id,username,password,mobile) VALUES (?,?,?,?,?)",
    userInfo: "SELECT id,username,password,mobile FROM users WHERE id = ?",//查找当前用户是否存在于数据库
    // 动态控制 通过body传来的数据动态更新用户的信息
    update: (body, id) => {
      let param = ''
      for (let i in body) {
        param += `${i} = '${body[i]}',`
      }
      param = param.substr(0, param.length - 1)
      return `UPDATE admin SET ${param} WHERE id = '${id}'`
    },
  },
  /* 小程序用户*/
  userCmsSql: {
    insert: "INSERT INTO admin (id,username,password,mobile) VALUES (?,?,?,?,?)",
    // 动态控制 通过body传来的数据动态更新用户的信息
    update: (body, id) => {
      let param = ''
      for (let i in body) {
        param += `${i} = '${body[i]}',`
      }
      param = param.substr(0, param.length - 1)
      return `UPDATE admin SET ${param} WHERE id = '${id}'`
    },//更新
    check: "SELECT id,username,password,mobile FROM admin WHERE mobile = ?",//查找当前用户是否存在于数据库
  },
  logCmsSql: {
    insert: "INSERT INTO log (id,name,username,user_id,query,path,is_success) VALUES (?,?,?,?,?,?,?)"
  }
};

module.exports = {
  applets,
  cms
};
