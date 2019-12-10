/**
 * register 注册
 * interface
 * bcrypt has加密
 * @type {*|void}
 */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const databaseConnect = require('../../mongodb/databaseConnection');
const Register = databaseConnect.Login;
const router = require('koa-router')();
//生成id
let id = mongoose.Types.ObjectId();

router.post('/', async (ctx, next) => {
  try {
    ctx.status = 200;
    let data, {account, password} = ctx.request.body;
    //密码加密
    let hasPassword = bcrypt.hashSync(password, 10);
    data = {
      code: 200,
      data: {
        message: '注册成功！'
      }
    };
    await Register.create({username: account, password: hasPassword}, (err, doc) => {
      if (!doc) {
        ctx.response.body = {
          error: true,
          code: '401',
          message: '注册失败',
        };
      } else {
        ctx.response.body = data;
        next();
      }
    });
  } catch (error) {
    ctx.response.body = {
      error: true,
      code: '00000',
      message: '服务器异常',
      desc: error.message
    }
  }
});

module.exports = router;

