const router = require('koa-router')();

router.post('/', async ctx => {
  ctx.body = {  //这是向前台返回的数据 因为没有连接数据库所以我们自己定义，后面讲连接数据库
    user: '222',
    code: 1,
    status: 200
  };
});

module.exports = router.routes();
