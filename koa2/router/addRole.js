/**
 * addRole 新增角色
 * @type {*|void}
 */
const bcrypt = require('bcrypt');
const databaseConnect = require('../../mongodb/databaseConnection');
const jwt = require('jsonwebtoken');
const addRole = databaseConnect.roleManagement;
const register = databaseConnect.Login;
const router = require('koa-router')();
router.post('/', async (ctx, next) => {
  try {
    //token 验证(过期,是否登陆)
    let tokenErr = jwt.verify(ctx.request.header.authorization, 'token', (err, authData) => {
      return err;
    });
    if (tokenErr) {
      ctx.response.body = {
        error: true,
        code: '401',
        message: '请重新登陆！',
      };
      return false;
    }
    ctx.status = 200;
    let findRoles, rolesSave, roles, users,
      hasPassword, {userName, roleName, password, iphone, sex, store, status} = ctx.request.body;
    const findError = (msg) => {
      ctx.response.body = {
        error: true,
        code: '400',
        message: msg,
      };
      return false;
    };
    //密码加密
    hasPassword = bcrypt.hashSync(password, 10);
    //users 用户
    users = {
      username: userName,
      password: hasPassword,
      iphone: iphone,
      sex: sex,
      route: []
    };
    //roles 角色
    roles = {
      userName: userName,
      roleName: roleName,
      password: hasPassword,
      iphone: iphone,
      age: age,
      store: store,
      status: status
    };
    findRoles = await addRole.find();
    for (let i = 0, len = findRoles.length; i < len; i++) {
      findRoles[i].userName === userName && findError('用户名已存在！');
      findRoles[i].iphone === iphone && findError('手机号码已存在！');
    }
    //用户名注册
    await register.create(users);
    //新增角色
    rolesSave = await addRole.create(roles);
    if (!rolesSave) {
      ctx.response.body = {
        error: true,
        code: '403',
        message: '新增失败！',
      };
    } else {
      ctx.response.body = {
        code: 200,
        message: '新增成功！'
      };
      next();
    }
  } catch (err) {
    if (err.code === 11000) {
      ctx.response.body = {
        error: true,
        code: '00000',
        message: '角色名已存在！',
      }
    } else {
      ctx.response.body = {
        error: true,
        code: '00000',
        message: '服务器异常！',
      }
    }
  }
});

module.exports = router;
