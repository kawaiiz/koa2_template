/**
 * 后端设置前端用户用户
 * */
const Router = require('koa-router');
const router = new Router();
const schema = require('async-validator');
const uuidv1 = require('uuid/v1');// 生成id使用
// 测试redis
const redis = require('../../libs/redis')

//自定义方法
const util = require('../../libs/utils')

// sql
let {common} = require('../../libs/sql');


/**
 * @desc 短信发送接口
 * @access 接口公开
 * @parameter mobile 存储在redis里  key:`${mobile}${msg}` value:msg
 *            type   短信类型  cmsLogin 后端登录 cmsSetPassword 忘记密码  appLogin 前端登录 appSetPassword 前端修改密码 appSetMobile 前端修改手机号
 * */
let registerRuler = {
  mobile: [{type: 'string', required: true, pattern: /^1\d{10}/, message: '请查看手机号格式是否正确'}]
}
let registerValidator = new schema(registerRuler);
router.post('/GetMsg', async (ctx) => {
  let result = {}
  try {
    let {mobile, type} = ctx.request.body;
    // 验证输入是否正确
    await registerValidator.validate(ctx.request.body)
    // 生成短信
    const msg = (Math.random() * 10000).toFixed(0)
    await redis.set(`${mobile}${type}`, msg, 'EX', 60 * 30)
    let redisMsg = await redis.get(`${mobile}${type}`)
    console.log(`${mobile}${type}: ${redisMsg}`)
    result = {
      status: 1,
      msg: '短信发送成功'
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
