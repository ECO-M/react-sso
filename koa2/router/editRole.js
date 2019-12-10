/**
 * editRole 修改角色
 * @type {*|void}
 */
const databaseConnect = require('../../mongodb/databaseConnection');
const jwt = require('jsonwebtoken');
const editRole = databaseConnect.roleManagement;
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
    let findRoles, rolesSave, roles, {id, roleName, iphone, sex, store, status} = ctx.request.body;
    if (!roleName && !iphone && !sex && !store) {
      roles = {
        status: status
      }
    } else {
      roles = {
        roleName: roleName,
        iphone: iphone,
        sex: sex,
        store: store,
        status: status
      };
    }
    findRoles = await editRole.find({_id: {$ne: id}});
    for (let i = 0, len = findRoles.length; i < len; i++) {
      if (findRoles[i].iphone === iphone) {
        ctx.response.body = {
          error: true,
          code: '400',
          message: '手机号已存在！',
        };
        return false;
      }
    }
  
    rolesSave = await editRole.update({_id: id}, roles);
    if (!rolesSave) {
      ctx.response.body = {
        error: true,
        code: '403',
        message: '修改失败！',
      };
    } else {
      ctx.response.body = {
        code: 200,
        message: '修改成功！'
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
