const koa = require('koa');

const bodyparser = require('koa-bodyparser');

// 实例化koa
const app = new koa();

// api 获得body的值
app.use(bodyparser({
  enableTypes: ['json', 'form'],
  multipart: true,
  formidable: {
    maxFileSize: 32 * 1024 * 1024,
  }
}));

module.exports = app;
