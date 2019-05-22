var jwt = require('jsonwebtoken');
const Router = require('koa-router');
const router = new Router();
const config = require('./key');
const appletsPage = ['/api/applets/users/login']
const cmsPage = ['/api/cms/admin/login', '/api/cms/admin/register']
const allowpage = appletsPage.concat(cmsPage)

/**
 * token验证 并写入后台操作日志
 * */
const checkLogin = async (ctx, next) => {
  if (allowpage.indexOf(ctx.originalUrl) > -1) {
    await next()
  } else {
    try {
      ctx.state = await jwt.verify(ctx.request.header.authorization, config.TOKEN_SECRET, {})
      await next()
    } catch (e) {
      let result = {}
      switch (e.name) {
        case 'TokenExpiredError':
          result.msg = '登录已过期，请重新登录'
          result.status = 2
          break
        case 'JsonWebTokenError':
        case 'NotBeforeError':
        default:
          result.msg = 'token错误，请使用正确的信息请求'
          result.status = 0
          break
      }
      ctx.body = result
    }
  }
}
router.use(checkLogin);

module.exports = (app) => {

  /**
   * 引入路由文件
   * */
    //前端路由
  const usersApp = require('../routes/applets/users');

  //后端路由
  const usersCms = require('../routes/cms/users');
  const adminCms = require('../routes/cms/admin');

  /**
   * 注册路由
   * */
  //前端路由
  router.use('/api/applets/users', usersApp);

  //后端路由
  router.use('/api/cms/admin', adminCms);
  router.use('/api/cms/users', usersCms);

// 配置路由
  app.use(router.routes()).use(router.allowedMethods());

};

