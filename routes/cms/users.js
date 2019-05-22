/**
 * 后端设置前端用户用户
 * */
const Router = require('koa-router');
const router = new Router();
const schema = require('async-validator');
const uuidv1 = require('uuid/v1');// 生成id使用

// 经过封装的方法
const query = require('../../libs/connection');//mysql 请求函数
const util = require('../../libs/utils')

// sql
let {applets} = require('../../libs/sql');
let {userSql} = applets

/**
 * @desc 小程序用户录入
 * @access 接口公开
 * @parameter username , password , mobile
 * */
let registerRuler = {
  username: [{type: 'string', required: true, message: '请输入姓名'}],
  password: [{type: 'string', required: true, message: '请输入密码'}],
  mobile: [{type: 'string', required: true, pattern: /^1\d{10}/, message: '请查看手机号格式是否正确'}]
}
let registerValidator = new schema(registerRuler);
router.post('/register', async (ctx) => {
  let result = {}
  try {
    let {username, password, mobile} = ctx.request.body;
    // 查询该手机号是否被已经被录入
    let user = await query(userSql.check, [mobile])
    if (user.length > 0) throw '该手机号已存在'
    // 验证输入是否正确
    await registerValidator.validate(ctx.request.body)
    // 生成数据id
    let id = uuidv1()
    //插入数据库
    await query(userSql.insert, [id, username, await util.enbcrypt(password), mobile])
    result = {
      status: 1,
      msg: '添加用户成功'
    }
    util.publicBody(ctx, result, ctx.state)
  } catch (e) {
    result = {
      status: 0,
      msg: util.publicError(e)
    }
    util.publicBody(ctx, result, ctx.state)
  }
});

/**
 * @desc 更新数据
 * @access 接口公开
 * @parameter username , password , mobile
 * */
let updataRuler = {
  username: [{type: 'string', message: '姓名不能为空', min: 1}],
  password: [{type: 'string', message: '密码不能为空', min: 1}],
  mobile: [{type: 'string', pattern: /^1\d{10}/, message: '请查看手机号格式是否正确'}]
}
let updataValidator = new schema(updataRuler);
router.post('/updata', async (ctx) => {
  let result = {}
  try {
    await updataValidator.validate(ctx.request.body)
    if (ctx.request.body.password) ctx.request.body.password = await util.enbcrypt(ctx.request.body.password)
    await query(userSql.update(ctx.request.body, '96f8a920-7b8b-11e9-9137-f91a6be68d5a'))
    result = {
      status: 1,
      msg: '修改成功'
    }
    util.publicBody(ctx, result, ctx.state)
  } catch (e) {
    result = {
      status: 0,
      msg: util.publicError(e)
    }
    util.publicBody(ctx, result, ctx.state)
  }
});

module.exports = router.routes();
