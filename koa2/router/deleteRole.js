/**
 * deleteRole 删除角色
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
    let rolesSave, {id} = ctx.request.body;
    rolesSave = await editRole.deleteOne({_id: id});
    if (!rolesSave) {
      ctx.response.body = {
        error: true,
        code: '403',
        message: '删除失败！',
      };
    } else {
      ctx.response.body = {
        code: 200,
        message: '删除成功！'
      };
      next();
    }
  } catch (err) {
    ctx.response.body = {
      error: true,
      code: '00000',
      message: '服务器异常！',
    }
  }
});

module.exports = router;
