/**
 * 后端用户
 * */
const Router = require('koa-router');
const router = new Router();
const schema = require('async-validator');
const uuidv1 = require('uuid/v1');// 生成id使用
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

// 经过封装的方法
const query = require('../../libs/connection');//mysql 请求函数
const util = require('../../libs/utils')
const config = require('../../config/key')

// sql
let {applets, cms} = require('../../libs/sql');
let {adminCmsSql, userCmsSql} = cms

/**
 * @desc 用户登录
 * @access 接口公开
 * @parameter type=>1(手机密码登录)/2（手机短信登录） mobile password msg
 * */

let loginRuler = {
  username: [{type: 'string', message: '姓名不能为空', min: 1}],
  password: [{type: 'string', message: '密码不能为空', min: 1}],
  mobile: [{type: 'string', pattern: /^1\d{10}/, message: '请查看手机号格式是否正确'}]
}
let loginValidator = new schema(loginRuler);
router.post('/login', async (ctx) => {
  let userInfo = {
    username:'',
    user_id:''
  }
  let result = {}
  try {
    let {username, password, mobile, type} = ctx.request.body;
    let user = await query(adminCmsSql.check, [mobile])
    userInfo = user[0]
    if (user.length === 0) throw '该手机号未在后台添加'
    // 验证输入是否正确
    await loginValidator.validate(ctx.request.body)
    if (type === 1) {
      // 检查登录的密码和库里的是否相同
      let result = await bcrypt.compareSync(password, user[0].password)
      // 相同
      if (result) {
        // token 中储存的数据
        let payload = {
          id: user[0].id,
          type: 'cms',
          username: user[0].username
        }
        const token = await jwt.sign(payload, config.TOKEN_SECRET, {expiresIn: 60*60})
        result = {
          data: {
            userInfo: user[0],
            token: token
          },
          status: 1,
          msg: '登录成功'
        }
        userInfo.type = 'cms'
        util.publicBody(ctx, result, user[0])
      } else {
        throw '密码错误'
      }
    }
  } catch (e) {
    userInfo.type = 'cms'
    result = {
      status: 0,
      msg: util.publicError(e)
    }
    util.publicBody(ctx, result, userInfo)
  }
})

/**
 * @desc 后台用户添加
 * @access 内部接口
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
    // 验证输入是否正确
    await registerValidator.validate(ctx.request.body)

    let {username, password, mobile} = ctx.request.body;
    // 查询该手机号是否被已经被录入
    let user = await query(adminCmsSql.check, [mobile])
    if (user.length > 0) throw '该手机号已存在'
    // 生成数据id
    let id = uuidv1()
    //插入数据库
    await query(adminCmsSql.insert, [id, username, await util.enbcrypt(password), mobile])
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
    await query(adminCmsSql.update(ctx.request.body, ctx.state.id))
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
