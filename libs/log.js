/**
 *打印日志
 * */
const query = require('./connection');//mysql 请求函数
const uuidv1 = require('uuid/v1');// 生成id使用

// sql
let {applets, cms} = require('./sql');
let {logCmsSql} = cms

// ctx 请求  flag 这次请求是1成功还是0失败  userInfo 这次操作的执行人
module.exports = async (ctx, flag, userInfo) => {
  try{
    let name = ''
    switch (ctx.originalUrl) {
      case '/api/cms/admin/login':
        name = "用户登录"
        break
      case '/api/cms/admin/register':
        name = "用户注册"
        break
      case '/api/cms/admin/updata':
        name = '用户更新数据'
    }
    console.log([uuidv1(), name, userInfo.username, userInfo.id, JSON.stringify(ctx.request.body), ctx.originalUrl, flag])
    await query(logCmsSql.insert, [uuidv1(), name, userInfo.username, userInfo.id, JSON.stringify(ctx.request.body), ctx.originalUrl, flag.toString()])
  }catch (e) {
    console.log(e)
  }
}
